/**
 * Representa um cargo, área ou trilha específica de um concurso.
 */
export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
}

/**
 * Representa um concurso público.
 */
export interface Concurso {
  id: string;
  nome: string;
  sigla?: string;
  esfera?: 'Federal' | 'Estadual' | 'Municipal' | 'Distrital';
  cargos: Cargo[];
  bancasSugeridas?: string[];
}

/**
 * Representa uma categoria de concursos (ex: Bancos, Segurança Pública).
 */
export interface CategoriaConcurso {
  id: string;
  nome: string;
  concursos: Concurso[];
}
