export interface ChangePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
