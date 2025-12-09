-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (CASCADE drops dependent objects)
DROP TABLE IF EXISTS review_answers CASCADE;
DROP TABLE IF EXISTS review_question CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS noten CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS "group" CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS lernfeld CASCADE;
DROP TABLE IF EXISTS academic_year CASCADE;
DROP TABLE IF EXISTS class_teacher_list CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS class CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS role CASCADE;

-- Create Role table
CREATE TABLE role (
                      id SERIAL PRIMARY KEY,
                      role_name VARCHAR(50) NOT NULL
);

-- Create Course table
CREATE TABLE course (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        code VARCHAR(10) NOT NULL,
                        name VARCHAR(200) NOT NULL,
                        description TEXT,
                        duration_years INTEGER NOT NULL DEFAULT 3,
                        creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Class table
CREATE TABLE class (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       course_id UUID NOT NULL,
                       cohort_year INTEGER NOT NULL,
                       name VARCHAR(50) NOT NULL,
                       description TEXT,
                       start_date DATE NOT NULL,
                       end_date DATE NOT NULL,
                       current_academic_year INTEGER NOT NULL DEFAULT 1,
                       status VARCHAR(20) DEFAULT 'active',
                       creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_class_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- Create User table (quoted because "user" is reserved in PostgreSQL)
CREATE TABLE "user" (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        username VARCHAR(100) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        role_id INTEGER NOT NULL,
                        class_id UUID,
                        is_active BOOLEAN NOT NULL DEFAULT TRUE,
                        creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        last_login TIMESTAMP,
                        CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
                        CONSTRAINT fk_user_class FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE SET NULL
);

-- Create Academic_Year table
CREATE TABLE academic_year (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               class_id UUID NOT NULL,
                               year_number INTEGER NOT NULL,
                               year_name VARCHAR(50) NOT NULL,
                               start_date DATE NOT NULL,
                               end_date DATE NOT NULL,
                               is_current BOOLEAN NOT NULL DEFAULT FALSE,
                               CONSTRAINT fk_ay_class FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE,
                               CONSTRAINT uk_class_year UNIQUE (class_id, year_number)
);

-- Create Class_Teacher_List table
CREATE TABLE class_teacher_list (
                                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                    teacher_id UUID NOT NULL,
                                    class_id UUID NOT NULL,
                                    assigned_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    CONSTRAINT fk_ctl_teacher FOREIGN KEY (teacher_id) REFERENCES "user"(id) ON DELETE CASCADE,
                                    CONSTRAINT fk_ctl_class FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE,
                                    CONSTRAINT uk_class_teacher UNIQUE (class_id, teacher_id)
);

-- Create Lernfeld table
CREATE TABLE lernfeld (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          course_id UUID NOT NULL,
                          name VARCHAR(200) NOT NULL,
                          description TEXT,
                          lernfeld_weighting NUMERIC(5,2) NOT NULL,
                          academic_year_level INTEGER,
                          CONSTRAINT fk_lernfeld_course FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- Create Project table
CREATE TABLE project (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         class_id UUID NOT NULL,
                         academic_year_id UUID,
                         name VARCHAR(200) NOT NULL,
                         description TEXT,
                         start_date DATE NOT NULL,
                         due_date DATE NOT NULL,
                         created_by UUID NOT NULL,
                         status VARCHAR(20) DEFAULT 'draft',
                         review_deadline TIMESTAMP,
                         creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_project_class FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE,
                         CONSTRAINT fk_project_ay FOREIGN KEY (academic_year_id) REFERENCES academic_year(id) ON DELETE SET NULL,
                         CONSTRAINT fk_project_creator FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create Group table (quoted because "group" is reserved in PostgreSQL)
CREATE TABLE "group" (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         name VARCHAR(100) NOT NULL,
                         project_id UUID NOT NULL,
                         created_by UUID NOT NULL,
                         creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_group_project FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
                         CONSTRAINT fk_group_creator FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create Group_Members table
CREATE TABLE group_members (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               member_id UUID NOT NULL,
                               group_id UUID NOT NULL,
                               joined_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT fk_gm_member FOREIGN KEY (member_id) REFERENCES "user"(id) ON DELETE CASCADE,
                               CONSTRAINT fk_gm_group FOREIGN KEY (group_id) REFERENCES "group"(id) ON DELETE CASCADE,
                               CONSTRAINT uk_group_member UNIQUE (group_id, member_id)
);

-- Create Noten table
CREATE TABLE noten (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       student_id UUID NOT NULL,
                       lernfeld_id UUID NOT NULL,
                       class_id UUID NOT NULL,
                       academic_year_id UUID,
                       project_id UUID,
                       value NUMERIC(5,2) NOT NULL,
                       given_by UUID NOT NULL,
                       teacher_comment TEXT,
                       date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_noten_student FOREIGN KEY (student_id) REFERENCES "user"(id) ON DELETE CASCADE,
                       CONSTRAINT fk_noten_lernfeld FOREIGN KEY (lernfeld_id) REFERENCES lernfeld(id) ON DELETE CASCADE,
                       CONSTRAINT fk_noten_class FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE,
                       CONSTRAINT fk_noten_ay FOREIGN KEY (academic_year_id) REFERENCES academic_year(id) ON DELETE SET NULL,
                       CONSTRAINT fk_noten_project FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE SET NULL,
                       CONSTRAINT fk_noten_teacher FOREIGN KEY (given_by) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create Review table
CREATE TABLE review (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        reviewer_id UUID NOT NULL,
                        reviewee_id UUID NOT NULL,
                        group_id UUID NOT NULL,
                        comment TEXT,
                        is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
                        submission_date TIMESTAMP,
                        creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES "user"(id) ON DELETE CASCADE,
                        CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES "user"(id) ON DELETE CASCADE,
                        CONSTRAINT fk_review_group FOREIGN KEY (group_id) REFERENCES "group"(id) ON DELETE CASCADE,
                        CONSTRAINT uk_one_review_per_pair UNIQUE (reviewer_id, reviewee_id, group_id)
);

-- Create Review_Question table
CREATE TABLE review_question (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 question_text TEXT NOT NULL,
                                 project_id UUID NOT NULL,
                                 question_order INTEGER NOT NULL DEFAULT 0,
                                 CONSTRAINT fk_rq_project FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
);

-- Create Review_Answers table
CREATE TABLE review_answers (
                                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                review_id UUID NOT NULL,
                                question_id UUID NOT NULL,
                                rate NUMERIC(3,2) NOT NULL,
                                comment TEXT,
                                CONSTRAINT fk_ra_review FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE,
                                CONSTRAINT fk_ra_question FOREIGN KEY (question_id) REFERENCES review_question(id) ON DELETE CASCADE,
                                CONSTRAINT uk_one_answer_per_question UNIQUE (review_id, question_id)
);

-- Create Indexes for performance
CREATE INDEX idx_user_username ON "user"(username);
CREATE INDEX idx_user_class ON "user"(class_id);
CREATE INDEX idx_class_course ON class(course_id);
CREATE INDEX idx_project_class ON project(class_id);
CREATE INDEX idx_group_project ON "group"(project_id);
CREATE INDEX idx_review_group ON review(group_id);
CREATE INDEX idx_noten_student ON noten(student_id);
CREATE INDEX idx_academic_year_class ON academic_year(class_id);
CREATE INDEX idx_lernfeld_course ON lernfeld(course_id);

-- Add comments for documentation
COMMENT ON TABLE "user" IS 'Users table - stores admin, teachers, and students';
COMMENT ON TABLE "group" IS 'Project groups table';
COMMENT ON COLUMN "user".role_id IS '1=ADMIN, 2=TEACHER, 3=STUDENT';
COMMENT ON COLUMN review.is_submitted IS 'TRUE if review has been submitted';