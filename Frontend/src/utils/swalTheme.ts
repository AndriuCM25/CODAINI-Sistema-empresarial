/**
 * Configuración de SweetAlert2 adaptada al tema CODAINI.
 * Uso: Swal.fire({ ...getSwalConfig(isDark), title: '...', ... })
 */

export interface SwalBaseConfig {
  background: string;
  color: string;
  customClass: {
    container: string;
    popup: string;
    confirmButton: string;
    cancelButton: string;
  };
  confirmButtonColor: string;
  cancelButtonColor: string;
}

/**
 * Retorna la configuración base de SweetAlert2 según el tema actual.
 */
export function getSwalConfig(isDark: boolean): SwalBaseConfig {
  if (isDark) {
    return {
      background: '#112240',
      color: '#CCD6F6',
      customClass: {
        container: 'swal2-dark',
        popup: 'swal2-dark',
        confirmButton: 'px-4 py-2 rounded-lg font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg font-semibold',
      },
      confirmButtonColor: '#64FFDA',
      cancelButtonColor: '#233554',
    };
  }
  return {
    background: '#FFFFFF',
    color: '#0A192F',
    customClass: {
      container: 'swal2-light',
      popup: 'swal2-light',
      confirmButton: 'px-4 py-2 rounded-lg font-semibold',
      cancelButton: 'px-4 py-2 rounded-lg font-semibold',
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
