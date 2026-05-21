import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind 클래스들을 조건부로 결합하고 
 * 중복된 클래스를 병합해주는 유틸리티 함수입니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}