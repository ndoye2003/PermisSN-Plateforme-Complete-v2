import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Centre } from '../models/centre.model';
import { SessionExamen } from '../models/session.model';
import { Reservation } from '../models/reservation.model';
import { Candidat } from '../models/candidat.model';
import { QuestionQcm, ResultatQcm } from '../models/qcm.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------------
  // ADMIN - GESTION DES COMPTES
  // -------------------------------------------------------------
  getAdminUsers(filters?: { role?: string; search?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<any[]>(`${this.API_URL}/admin/users`, { params });
  }

  createAdminUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/admin/users`, data);
  }

  updateAdminUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/admin/users/${id}`, data);
  }

  resetAdminUserPassword(id: number, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/admin/users/${id}/reset-password`, { password });
  }

  deleteAdminUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/admin/users/${id}`);
  }

  // -------------------------------------------------------------
  // CENTRES & SESSIONS (Centre de Castors, Dakar)
  // -------------------------------------------------------------
  getCentres(region?: string): Observable<Centre[]> {
    return this.http.get<Centre[]>(`${this.API_URL}/centres`);
  }

  getSessions(filters?: { centre_id?: number; categorie_permis?: string; date_session?: string }): Observable<SessionExamen[]> {
    let params = new HttpParams();
    if (filters?.centre_id) params = params.set('centre_id', filters.centre_id.toString());
    if (filters?.categorie_permis) params = params.set('categorie_permis', filters.categorie_permis);
    if (filters?.date_session) params = params.set('date_session', filters.date_session);

    return this.http.get<SessionExamen[]>(`${this.API_URL}/sessions`, { params });
  }

  // -------------------------------------------------------------
  // CANDIDAT
  // -------------------------------------------------------------
  getCandidatProfile(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/candidat/profile`);
  }

  updateCandidatProfile(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/candidat/profile`, data);
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/candidat/documents`, formData);
  }

  getActiveReservation(): Observable<{ reservation: Reservation | null; qr_data_uri?: string }> {
    return this.http.get<any>(`${this.API_URL}/reservations/active`);
  }

  createReservation(sessionId: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reservations`, { session_id: sessionId });
  }

  cancelReservation(reservationId: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reservations/${reservationId}/cancel`, {});
  }

  // -------------------------------------------------------------
  // QCM & ENTRAÎNEMENT AVEC AUDIO WOLOF
  // -------------------------------------------------------------
  getQcmQuestions(theme?: string): Observable<QuestionQcm[]> {
    return this.http.get<QuestionQcm[]>(`${this.API_URL}/qcm/questions`);
  }

  submitQcm(reponses: { [questionId: number]: number }): Observable<ResultatQcm> {
    return this.http.post<ResultatQcm>(`${this.API_URL}/qcm/submit`, { reponses });
  }

  // -------------------------------------------------------------
  // AGENT DE CENTRE (Castors)
  // -------------------------------------------------------------
  getAgentSessions(date?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/agent/sessions`);
  }

  getSessionCandidates(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/agent/sessions/${sessionId}/candidats`);
  }

  scanQrCode(qrToken: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/agent/scan-qr`, { qr_token: qrToken });
  }

  saveResultat(data: { reservation_id: number; score: number; observations?: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/agent/resultats`, data);
  }

  // -------------------------------------------------------------
  // ADMINISTRATEUR
  // -------------------------------------------------------------
  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/admin/stats`);
  }

  getAdminCandidats(statut?: string, search?: string): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.API_URL}/admin/candidats`);
  }

  validerDossier(candidatId: number, statut: 'valide' | 'rejete', motifRejet?: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/admin/candidats/${candidatId}/valider`, { statut, motif_rejet: motifRejet });
  }

  createSession(sessionData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/admin/sessions`, sessionData);
  }

  getSmartScheduling(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/admin/smart-scheduling`);
  }

}
