package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;

public class ImportResultDto {

    private int totalRows;
    private int successCount;
    private int errorCount;
    private List<String> errors;

    public ImportResultDto(int totalRows, int successCount, int errorCount, List<String> errors) {
        this.totalRows = totalRows;
        this.successCount = successCount;
        this.errorCount = errorCount;
        this.errors = errors;
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public void setErrorCount(int errorCount) {
        this.errorCount = errorCount;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
