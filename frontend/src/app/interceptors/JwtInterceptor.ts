import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const stored = localStorage.getItem('user');
  const token = stored ? JSON.parse(stored).token : null;

  console.log("Interceptor hit");
  console.log(token, stored);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};