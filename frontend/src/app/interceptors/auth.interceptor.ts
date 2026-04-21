import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      // ИСПРАВЛЕНИЕ C4: заменяем Bearer на Token
      headers: req.headers.set('Authorization', `Token ${token}`)
    });
    return next(authReq);
  }
  return next(req);
};