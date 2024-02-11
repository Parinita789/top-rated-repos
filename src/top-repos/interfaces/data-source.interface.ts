import { ProgrammingLanguage } from "../types/programming-language";

export interface DataSource {
  fetchTopRatedRepo(date: string, language: ProgrammingLanguage, limit?: number): any
}