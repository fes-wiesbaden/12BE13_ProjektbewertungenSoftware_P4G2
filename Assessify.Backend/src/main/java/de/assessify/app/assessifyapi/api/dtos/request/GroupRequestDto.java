package de.assessify.app.assessifyapi.api.dtos.request;

import lombok.Builder;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

public record GroupRequestDto (String name,

                               Integer projectId,

                               Integer createdBy) {


}