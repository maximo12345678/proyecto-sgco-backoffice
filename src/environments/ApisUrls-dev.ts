export const ApiGetContracargos = {
    production: false,
    apiUrl: '${API_GATEWAY}/contracargos/getcontracargos'
};


export const ApiCambioEstado = {
    production: false,
    apiUrl: '${API_GATEWAY}/cambioestado'
};


export const ApiGetJsonFormulario = {
    production: false,
    apiUrl: '${API_GATEWAY}/config'
};


export const ApiPostJsonFormulario = {
    production: false,
    apiUrl: '${API_GATEWAY}/disputa/createdisputacbk'
};


export const ApiGetHistorialCaso = {
    production: false,
    apiUrl: '${API_GATEWAY}/contracargos/historial'
};


export const ApiGetIndicadores = {
    production: false,
    apiUrl: '${API_GATEWAY}/getindicators'
};


export const ApiGetListaComercios = {
    production: false,
    apiUrl: '${API_GATEWAY}/comercios/getall'
};


export const ApiGetEvicenciaPath = {
    production: false,
    apiUrl: '${API_GATEWAY}/evidencias/get'
};


export const ApiGetGruposMcc = {
  production: false,
  apiUrl: '${API_GATEWAY}/grupoMcc/getAll'
};

export const ApiGetGruposMccById = {
  production: false,
  apiUrl: '${API_GATEWAY}/grupoMcc/getById'
};

export const ApiGetCriteriosValidacion = {
  production: false,
  apiUrl: '${API_GATEWAY}/getCriterioValidacionContracargo'
};

export const ApiGetiCriterioValidacionById = {
  production: false,
  apiUrl: '${API_GATEWAY}/criteriovalidacion/getById'
};

export const ApiPostCriteriosValidacion = {
  production: false,
  apiUrl: '${API_GATEWAY}/criteriovalidacion/create'
};

export const ApiGetConfiguracionContadores = {
  production: false,
  apiUrl: '${API_GATEWAY}/configuraciones/contadores/getall'
};

export const ApiUpdateConfiguracionContadores = {
  production: false,
  apiUrl: '${API_GATEWAY}/configuraciones/contadores/update'
};

export const ApiPostMotivo = {
  production: false,
  apiUrl: '${API_GATEWAY}/createMotivoAdmin'
};

export const ApiPostEvicencia = {
  production: false,
  apiUrl: '${API_GATEWAY}/evidencias/create'
};

export const ApiGetMotivos = {
  production: false,
  apiUrl: '${API_GATEWAY}/getMotivosAll'
};

export const ApiPutMotivoAdmin = {
  production: false,
  apiUrl: '${API_GATEWAY}/updatecbkmotivobyadmin'
};

export const ApiPutMotivoAnalista = {
  production: false,
  apiUrl: '${API_GATEWAY}/updatecbkmotivobyanalista'
};

export const ApiPostRechazarEvidencia = {
  production: false,
  apiUrl: '${API_GATEWAY}/evidencias/rechazar'
};

export const ApiPutUpdateComercios = {
  production: false,
  apiUrl: '${API_GATEWAY}/comercios/updateComercio'
};

export const ApiPostAmpliarPlazoGestion = {
  production: false,
  apiUrl: '${API_GATEWAY}/extendcbkdeadline'
};

export const ApiGetAlertasAdmin = {
  production: false,
  apiUrl: '${API_GATEWAY}/alertaContador/administrador'
};

export const ApiGetAlertasAnalista = {
  production: false,
  apiUrl: '${API_GATEWAY}/alertaContador/analista'
};

export const ApiGetContracargosDescargaCsv = {
  production: false,
  apiUrl: '${API_GATEWAY}/contracargos/descarga-csv'
};

export const ApiKey = {
    key: '${API_KEY}'
}


export const ApiAuthLogin = {
    production: false,
    apiUrl: '${API_GATEWAY_AUTH}/login/backoffice'
};

export const ApiAuthRefreshTokens = {
    production: false,
    apiUrl: '${API_GATEWAY_AUTH}/tokens/backoffice'
};

export const ApiKeyAuth = {
    key: '${API_KEY_AUTH}'
}

