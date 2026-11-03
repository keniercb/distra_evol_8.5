<?php

class DatFiltroReporteModel extends ZendExt_Model
{
    private $datfiltroreporte;
    private $datfiltrotexto;
    private $datfiltronumero;
    private $datfiltronomenclador;
    private $datfiltroestructura;

    function __construct()
    {
        $this->datfiltroreporte = new DatFiltroReporte();
        $this->datfiltrotexto = new DatFiltroReporteTexto();
        $this->datfiltronumero = new DatFiltroReporteNumerico();
        $this->datfiltronomenclador = new DatFiltroReporteNomenclador();
        $this->datfiltroestructura = new DatFiltroReporteEstructura();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarFiltroReporte($params)
    {
        return $this->datfiltroreporte->listarFiltroReportes($params);
    }

    public function adicionarFiltroReporte($params)
    {
        $params['accion'] = 'adicionar';
        $result = self::validarParametrosObligatorios($params);
        if ($result == 1) {
            extract($params);
            try {
                $this->datfiltroreporte = new DatFiltroReporte();
                $this->datfiltroreporte->denominacion = $denominacion;
                $this->datfiltroreporte->orden = $orden;
                $this->datfiltroreporte->tipo = $tipo;
                $this->datfiltroreporte->anchocolumna = $anchocolumna;
                $this->datfiltroreporte->nombreparametro = $nombreparametro;
                $this->datfiltroreporte->denominaciontipo = $denominaciontipo;
                $this->datfiltroreporte->valorpordefecto = $valorpordefecto;
                $this->datfiltroreporte->idreporte = $idreporte;
                $this->datfiltroreporte->save();
                $idfiltroreporte = $this->datfiltroreporte->idfiltro;
                if ($tipo == 1) {
                    $this->datfiltrotexto->idfiltro = $idfiltroreporte;
                    $this->datfiltrotexto->longitudminima = $longitudminima;
                    $this->datfiltrotexto->longitudmaxima = $longitudmaxima;
                    $this->datfiltrotexto->save();
                } else if ($tipo == 2) {
                    $this->datfiltronumero->idfiltro = $idfiltroreporte;
                    $this->datfiltronumero->valorminimo = $valorminimo;
                    $this->datfiltronumero->valormaximo = $valormaximo;
                    $this->datfiltronumero->save();
                } else if ($tipo == 4) {
                    $this->datfiltronomenclador->idfiltro = $idfiltroreporte;
                    $this->datfiltronomenclador->nomidentificador = $nomidentificador;
                    $this->datfiltronomenclador->nomdenominacion = $nomdenominacion;
                    $this->datfiltronomenclador->tipofuentedatos = $tipofuentedatos;
                    $this->datfiltronomenclador->paginado = $paginado;
                    $this->datfiltronomenclador->sentenciasql = $sentenciasql;
                    $this->datfiltronomenclador->nomservicio = $nomservicio;
                    $this->datfiltronomenclador->enviarid = $enviarid;
                    $this->datfiltronomenclador->save();
                } else if ($tipo == 6) {
                    $this->datfiltroestructura->idfiltro = $idfiltroreporte;
                    $this->datfiltroestructura->estructuracompleta = $estructuracompleta;
                    $this->datfiltroestructura->save();
                }
                return 1;  //ok
            } catch (Exception $e) {
                print_r($e->getMessage());
                return -1; //error
            }
        } else return $result; //3- campos obligatorios vacios; 5- estructura ya adicionada
    }

    public function adicionarArrayFiltroReportes($params)
    {
        extract($params);
        if (empty($idreporte)) {
            return -1; //error al adicionar el reporte
        } else if (isset($arrayfiltros[0])) {
            $validar = 1; //ok
            foreach ($arrayfiltros as $key => $filtro) {
                $parametros = get_object_vars($filtro);
                $parametros['accion'] = 'adicionar';
                $parametros['idreporte'] = $idreporte;
                $result = self::validarParametrosObligatorios($parametros);
                if ($result == 1) {
                    $datfiltroreporte = new DatFiltroReporte();
                    $datfiltroreporte->denominacion = $filtro->denominacion;
                    $datfiltroreporte->orden = $filtro->orden;
                    $datfiltroreporte->tipo = $filtro->tipo;
                    $datfiltroreporte->anchocolumna = $filtro->anchocolumna;
                    $datfiltroreporte->nombreparametro = $filtro->nombreparametro;
                    $datfiltroreporte->denominaciontipo = $filtro->denominaciontipo;
                    $datfiltroreporte->valorpordefecto = $filtro->valorpordefecto;
                    $datfiltroreporte->idreporte = $idreporte;
                    $datfiltroreporte->save();
                    $idfiltroreporte = $datfiltroreporte->idfiltro;
                    $tipo = $filtro->tipo;
                    if ($tipo == 1) {
                        $datfiltrotexto = new DatFiltroReporteTexto();
                        $datfiltrotexto->idfiltro = $idfiltroreporte;
                        $datfiltrotexto->longitudminima = $filtro->longitudminima;
                        $datfiltrotexto->longitudmaxima = $filtro->longitudmaxima;
                        $datfiltrotexto->save();
                    } else if ($tipo == 2) {
                        $datfiltronumero =new DatFiltroReporteNumerico();
                        $datfiltronumero->idfiltro = $idfiltroreporte;
                        $datfiltronumero->valorminimo = $filtro->valorminimo;
                        $datfiltronumero->valormaximo = $filtro->valormaximo;
                        $datfiltronumero->save();
                    } else if ($tipo == 4) {
                        $datfiltronomenclador = new DatFiltroReporteNomenclador();
                        $datfiltronomenclador->idfiltro = $idfiltroreporte;
                        $datfiltronomenclador->nomidentificador = $filtro->nomidentificador;
                        $datfiltronomenclador->nomdenominacion = $filtro->nomdenominacion;
                        $datfiltronomenclador->tipofuentedatos = $filtro->tipofuentedatos;
                        $datfiltronomenclador->paginado = $filtro->paginado;
                        $datfiltronomenclador->sentenciasql = $filtro->sentenciasql;
                        $datfiltronomenclador->nomservicio = $filtro->nomservicio;
                        $datfiltronomenclador->enviarid = $filtro->enviarid;
                        $datfiltronomenclador->save();
                    } else if ($tipo == 6) {
                        $datfiltroestructura = new DatFiltroReporteEstructura();
                        $datfiltroestructura->idfiltro = $idfiltroreporte;
                        $datfiltroestructura->estructuracompleta = $filtro->estructuracompleta;
                        $datfiltroestructura->save();
                    }
                } else $validar = 6; //hubo algunos filtros que no fueron adicionados
            }
            return $validar;
        }
    }

    public function adicionarArrayFiltroReportesOld($params)
    {
        extract($params);
        if (empty($idreporte)) {
            return -1; //error al adicionar el reporte
        } else if (isset($arrayfiltros[0])) {
            $validar = 1; //ok
            foreach ($arrayfiltros as $key => $filtro) {
                $parametros = get_object_vars($filtro);
                $parametros['accion'] = 'adicionar';
                $parametros['idreporte'] = $idreporte;
                $result = self::validarParametrosObligatorios($parametros);
                if ($result == 1) {
                    $this->datfiltroreporte->denominacion = $filtro->denominacion;
                    $this->datfiltroreporte->orden = $filtro->orden;
                    $this->datfiltroreporte->tipo = $filtro->tipo;
                    $this->datfiltroreporte->anchocolumna = $filtro->anchocolumna;
                    $this->datfiltroreporte->nombreparametro = $filtro->nombreparametro;
                    $this->datfiltroreporte->denominaciontipo = $filtro->denominaciontipo;
                    $this->datfiltroreporte->valorpordefecto = $filtro->valorpordefecto;
                    $this->datfiltroreporte->idreporte = $idreporte;
                    $this->datfiltroreporte->save();
                    $idfiltroreporte = $this->datfiltroreporte->idfiltro;
                    $tipo = $filtro->tipo;
                    if ($tipo == 1) {
                        $this->datfiltrotexto->idfiltro = $idfiltroreporte;
                        $this->datfiltrotexto->longitudminima = $filtro->longitudminima;
                        $this->datfiltrotexto->longitudmaxima = $filtro->longitudmaxima;
                        $this->datfiltrotexto->save();
                    } else if ($tipo == 2) {
                        $this->datfiltronumero->idfiltro = $idfiltroreporte;
                        $this->datfiltronumero->valorminimo = $filtro->valorminimo;
                        $this->datfiltronumero->valormaximo = $filtro->valormaximo;
                        $this->datfiltronumero->save();
                    } else if ($tipo == 4) {
                        $this->datfiltronomenclador->idfiltro = $idfiltroreporte;
                        $this->datfiltronomenclador->nomidentificador = $filtro->nomidentificador;
                        $this->datfiltronomenclador->nomdenominacion = $filtro->nomdenominacion;
                        $this->datfiltronomenclador->tipofuentedatos = $filtro->tipofuentedatos;
                        $this->datfiltronomenclador->paginado = $filtro->paginado;
                        $this->datfiltronomenclador->sentenciasql = $filtro->sentenciasql;
                        $this->datfiltronomenclador->nomservicio = $filtro->nomservicio;
                        $this->datfiltronomenclador->enviarid = $filtro->enviarid;
                        $this->datfiltronomenclador->save();
                    } else if ($tipo == 6) {
                        $this->datfiltroestructura->idfiltro = $idfiltroreporte;
                        $this->datfiltroestructura->estructuracompleta = $filtro->estructuracompleta;
                        $this->datfiltroestructura->save();
                    }
                } else $validar = 6; //hubo algunos filtros que no fueron adicionados
            }
            return $validar;
        }
    }

    public function modificarFiltroReporte($params)
    {
        if (!empty($params['idfiltro'])) {
            $params['accion'] = 'modificar';
            $result = self::validarParametrosObligatorios($params);
            if ($result == 1) {
                extract($params);
                try {
                    $datfiltroreporte = Doctrine::getTable('DatFiltroReporte')->find($idfiltro);
                    if (isset($datfiltroreporte->idfiltro)) {
                        $datfiltroreporte->denominacion = $denominacion;
                        $datfiltroreporte->orden = $orden;
                        $datfiltroreporte->anchocolumna = $anchocolumna;
                        $datfiltroreporte->nombreparametro = $nombreparametro;
                        $datfiltroreporte->valorpordefecto = $valorpordefecto;
                        $datfiltroreporte->save();
                        if ($tipo == 1) { //texto
                            $datfiltrotexto = Doctrine::getTable('DatFiltroReporteTexto')->find($idfiltro);
                            if (isset($datfiltrotexto->idfiltro)) {
                                $datfiltrotexto->longitudminima = $longitudminima;
                                $datfiltrotexto->longitudmaxima = $longitudmaxima;
                                $datfiltrotexto->save();
                            } else return 2; //no existe
                        } else if ($tipo == 2) { //numero
                            $datfiltronumero = Doctrine::getTable('DatFiltroReporteNumerico')->find($idfiltro);
                            if (isset($datfiltronumero->idfiltro)) {
                                $datfiltronumero->valorminimo = $valorminimo;
                                $datfiltronumero->valormaximo = $valormaximo;
                                $datfiltronumero->save();
                            } else return 2; //no existe
                        } else if ($tipo == 4) { //nomenclador
                            $datfiltronomenclador = Doctrine::getTable('DatFiltroReporteNomenclador')->find($idfiltro);
                            if (isset($datfiltronomenclador->idfiltro)) {
                                $datfiltronomenclador->nomidentificador = $nomidentificador;
                                $datfiltronomenclador->nomdenominacion = $nomdenominacion;
                                $datfiltronomenclador->tipofuentedatos = $tipofuentedatos;
                                $datfiltronomenclador->paginado = $paginado;
                                $datfiltronomenclador->sentenciasql = $sentenciasql;
                                $datfiltronomenclador->nomservicio = $nomservicio;
                                $datfiltronomenclador->enviarid = $enviarid;
                                $datfiltronomenclador->save();
                            } else return 2; //no existe
                        } else if ($tipo == 6) { //estructura
                            $datfiltroestructura = Doctrine::getTable('DatFiltroReporteEstructura')->find($idfiltro);
                            if (isset($datfiltroestructura->idfiltro)) {
                                $datfiltroestructura->estructuracompleta = $estructuracompleta;
                                $datfiltroestructura->save();
                            } else {
                                $this->datfiltroestructura->idfiltro = $idfiltro;
                                $this->datfiltroestructura->estructuracompleta = $estructuracompleta;
                                $this->datfiltroestructura->save();
                            }
                        }
                        return 1;  //ok
                    } else return 2; //no existe filtro
                } catch (Exception $e) {
                    print_r($e->getMessage());
                    return -1; //error
                }
            } else return $result; //3- campos obligatorios vacios; 5- estructura ya adicionada
        } else return 4; //Seleccionar un filtro
    }

    public function validarParametrosObligatorios($params)
    {
        extract($params);
        if (empty($denominacion) || empty($tipo) ||
            ($tipo != 6 && (empty($anchocolumna) || empty($nombreparametro))) ||
            ($tipo == 1 && empty($longitudmaxima)) ||
            ($tipo == 2 && empty($valormaximo)) ||
            ($tipo == 4 && (empty($nomidentificador) || empty($nomdenominacion) || ($tipofuentedatos == '1' && empty($sentenciasql)) ||
                    ($tipofuentedatos == '0' && empty($nomservicio)))))
            return 3; //campos obligatorios vacios
        if ($tipo == 6 && $accion == 'adicionar') { //estructura
            $existefiltroestructura = $this->datfiltroreporte->obtenerFiltroEstructuraDadoIdReporte($params);
            if (isset($existefiltroestructura[0]))
                return 5; //ya existe un filtro estructura
        }
        $existefiltronombreparametro = $this->datfiltroreporte->existeNombreParametroDadoIdReporte($params);
        if (isset($existefiltronombreparametro[0]) && ($accion == 'adicionar' ||
                ($accion == 'modificar' && $existefiltronombreparametro[0]['idfiltro'] != $idfiltro)))
            return 6; //ya existe un filtro con el nombre del parametro
        return 1;
    }

    public function validarParametrosObligatoriosOld($params)
    {
        extract($params);
        if (empty($denominacion) || empty($tipo) ||
            ($tipo != 6 && (empty($anchocolumna) || empty($nombreparametro))) ||
            ($tipo == 1 && empty($longitudmaxima)) ||
            ($tipo == 2 && empty($valormaximo)) ||
            ($tipo == 4 && (empty($nomidentificador) || empty($nomdenominacion) || ($tipofuentedatos == '1' && empty($sentenciasql)) ||
                    ($tipofuentedatos == '0' && empty($nomservicio)))))
            return 3; //campos obligatorios vacios
        else if ($tipo == 6 && $accion == 'adicionar') { //estructura
            $existefiltroestructura = $this->datfiltroreporte->obtenerFiltroEstructuraDadoIdReporte($params);
            if (isset($existefiltroestructura[0]))
                return 5; //ya existe un filtro estructura
            else return 1;
        } else return 1;
    }

    public function eliminarFiltroReporte($arrayidfiltros)
    {
        $noexiste = 0;
        try {
            foreach ($arrayidfiltros as $idfiltro) {
                $objelemento = Doctrine::getTable('DatFiltroReporte')->find(
                    $idfiltro
                );
                if (isset($objelemento->idfiltro)) $objelemento->delete();
                else $noexiste++;
            }
        } catch (Exception $e) {
            $noexiste++;
        }
        $cant = count($arrayidfiltros);
        if ($cant == 1) {
            if ($noexiste) $mensaje = 0; //mensaje :el elemento no existe en el registro
            else $mensaje = 1; //mensaje :elemento eliminado correctamente
        }
        if ($cant > 1) {
            if (!$noexiste) $mensaje = 1; // mensaje :elementos eliminados correctamente
            else if ($noexiste == $cant) $mensaje = 0; //los elementos no existen en el registro
            else $mensaje = 2; //algunos elementos no fueron eliminados
        }
        return $mensaje;
    }

    public function obtenerFiltroReporteDadoId($parametros)
    {
        extract($parametros);
        if (!empty($idfiltro)) {
            $result = $this->datfiltroreporte->obtenerFiltroReporteDadoIdSql($parametros);
            if (isset($result[0]['idfiltro'])) {
                return $result[0];
            } else return 0; //no se encuentra el reporte
        } else return 2; //falta id reporte

    }

    public function cargarDatosNomenclador($params)
    {
        $datfiltronomenclador = Doctrine::getTable('DatFiltroReporteNomenclador')->find($params['idfiltro']);
        if (isset($datfiltronomenclador->idfiltro)) {
            $params['sentenciasql'] = $datfiltronomenclador->sentenciasql;
            return $this->datfiltroreporte->cargarDatosNomenclador($params);
        } else return 2; //no existe
    }

}
