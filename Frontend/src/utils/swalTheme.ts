/**
 * Configuración de SweetAlert2 adaptada al tema CODAINI.
 * Uso: Swal.fire({ ...getSwalConfig(isDark), title: '...', ... })
 */

export interface SwalBaseConfig {
  customClass: {
    popup: string;
    confirmButton: string;
    cancelButton: string;
  };
  background?: string;
  color?: string;
  confirmButtonColor: string;
  cancelButtonColor: string;
}

/**
 * Retorna la configuración base de SweetAlert2 según el tema actual.
 */
export function getSwalConfig(isDark: boolean): SwalBaseConfig {
  if (isDark) {
    return {
      customClass: {
        popup: 'swal2-dark',
        confirmButton: '',
        cancelButton: '',
      },
      confirmButtonColor: '#64FFDA',
      cancelButtonColor: '#233554',
    };
  }
  return {
    customClass: {
      popup: 'swal2-light',
      confirmButton: '',
      cancelButton: '',
    },
    confirmButtonColor: '#0F766E',
    cancelButtonColor: '#CBD5E1',
  };
}

/**
 * Configuración para alertas de confirmación de eliminación
 */
export function getSwalDeleteConfig(isDark: boolean) {
  return {
    ...getSwalConfig(isDark),
    icon: 'warning' as const,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#EF4444',
    cancelButtonColor: isDark ? '#233554' : '#CBD5E1',
  };
}

/**
 * Configuración para alertas de éxito rápidas (auto-cierre)
 */
export function getSwalSuccessConfig(isDark: boolean) {
  return {
    ...getSwalConfig(isDark),
    icon: 'success' as const,
    timer: 2000,
    showConfirmButton: false,
  };
}
