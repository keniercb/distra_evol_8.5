<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmprelacionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }	

    /**
     *
     */
    public function CargarTiposElementosARelacionar(
        $tipoelemento, $relacionesiniciales, $tributar
    ) {
        $arrayrelaciones = array();
        $cont = 0;
        switch ($tipoelemento) {
            case 5:
                $arrayrelaciones[$cont]['idtipoelemento'] = 0;
                $arrayrelaciones[$cont]['denominacion'] = 'Plan';
                break;
            case 3://Actividad
                $arrayrelaciones[$cont]['idtipoelemento'] = 0;
                $arrayrelaciones[$cont]['denominacion'] = 'Plan';
                $cont++;
                if ($relacionesiniciales != 1) {
                    $arrayrelaciones[$cont]['idtipoelemento'] = 50;
                    $arrayrelaciones[$cont]['denominacion'] = 'Plan - ARC';
                    $cont++;
                }
                $arrayrelaciones[$cont]['idtipoelemento'] = 1;
                $arrayrelaciones[$cont]['denominacion'] = 'Objetivo';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 2;
                $arrayrelaciones[$cont]['denominacion'] = 'FIP';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 6;
                $arrayrelaciones[$cont]['denominacion'] = 'Desviación';
                $cont++;				
				if ($tributar != 1) {
                $arrayrelaciones[$cont]['idtipoelemento'] = 7;
                $arrayrelaciones[$cont]['denominacion'] = 'Dependencia total';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 8;
                $arrayrelaciones[$cont]['denominacion']
                    = 'Dependencia porcentual';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 9;
                $arrayrelaciones[$cont]['denominacion']
                    = 'Dependencia puerta abierta';
                $cont++;
				}
                break;
            case 1://Objetivo
				$arrayrelaciones[$cont]['idtipoelemento'] = 0;
                $arrayrelaciones[$cont]['denominacion'] = 'Plan';
                $cont++;
                if ($relacionesiniciales != 1) {
                    $arrayrelaciones[$cont]['idtipoelemento'] = 50;
                    $arrayrelaciones[$cont]['denominacion'] = 'Plan - ARC';
                    $cont++;
                }
                $arrayrelaciones[$cont]['idtipoelemento'] = 2;
                $arrayrelaciones[$cont]['denominacion'] = 'FIP';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 6;
                $arrayrelaciones[$cont]['denominacion'] = 'Desviación';
                $cont++;
                break;
            case 9://Hito
                $arrayrelaciones[$cont]['idtipoelemento'] = 11;
                $arrayrelaciones[$cont]['denominacion'] = 'Proyecto';
                break;
            case 10://Tarea
                /*$arrayrelaciones[$cont]['idtipoelemento'] = 11;
                $arrayrelaciones[$cont]['denominacion'] = 'Proyecto';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 12;
                $arrayrelaciones[$cont]['denominacion'] = 'Hito';
                $cont++;*/
                $arrayrelaciones[$cont]['idtipoelemento'] = 7;
                $arrayrelaciones[$cont]['denominacion'] = 'Dependencia total';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 8;
                $arrayrelaciones[$cont]['denominacion']
                    = 'Dependencia porcentual';
                $cont++;
                $arrayrelaciones[$cont]['idtipoelemento'] = 9;
                $arrayrelaciones[$cont]['denominacion']
                    = 'Dependencia puerta abierta';
                break;
        }
        return $arrayrelaciones;
    }

    /**
     *
     */
    public function RelacionarElementos(
        $idelemento, $idtipoelemento, $arrayelementosrelacionados,
        $parentrelacidelemento, $idautorrelacion
    ) {

        if ($idtipoelemento == 5) {
            $objhijo = Doctrine::getTable('DatArc')->find($idelemento);
            $idobjetohijo = $objhijo->idarc;
        } else {
            $objhijo = Doctrine::getTable('DatElementos')->find($idelemento);
            $idobjetohijo = $objhijo->idelemento;
        }

        if (!$idobjetohijo) {
            $respuesta = 0;
        } else {
            if (isset($arrayelementosrelacionados[0])) {
                $elementosrelacionados = 0;
                foreach ($arrayelementosrelacionados as $elementorelacionado) {
                    $idplan = $elementorelacionado->idplan;
                    $idarc = $elementorelacionado->idarc;
                    //$idobjetivo = $elementorelacionado->idobjetivo;
                    //$idfip = $elementorelacionado->idfip;
                    $iddesviacion = $elementorelacionado->iddesviacion;
                    $idactividad = $elementorelacionado->idactividad;
                    if ($idautorrelacion == null) {
                        $idautorrelacion
                            = $elementorelacionado->idautorrelacion;
                    }

                    switch ($elementorelacionado->tipoelemento) {
                        case 50:
                            if ($idtipoelemento == 3) {
                              if($idarc!=''){
                                $existearcplan = Doctrine::getTable(
                                    'DatArcDatPlan'
                                )->findByDql(
                                    "idarc = '$idarc' AND idplan = '$idplan'"
                                );
                                if (!isset($existearcplan[0]->idarc)
                                    || $existearcplan[0]->idarc == ''
                                ) {
                                    $objarcplan = new DatArcDatPlan();
                                    $objarcplan->idarc = $idarc;
                                    $objarcplan->idplan = $idplan;
                                    $objarcplan->idautorrelacion
                                        = $idautorrelacion;
                                    $objarcplan->save();
                                }
                                $existearcplanactividad = Doctrine::getTable(
                                    'DatArcDatPlanActividades'
                                )->findByDql(
                                    "idarc = '$idarc' AND idplan = '$idplan'
                                        AND idactividad = '$idelemento'"
                                );
                                if (!isset($existearcplanactividad[0]->idarc)
                                    || $existearcplanactividad[0]->idarc == ''
                                ) {
                                    $objarcplanactividad
                                        = new DatArcDatPlanActividades();
                                    $objarcplanactividad->idarc = $idarc;
                                    $objarcplanactividad->idplan = $idplan;
                                    $objarcplanactividad->idactividad
                                        = $idelemento;
                                    $objarcplanactividad->idautor
                                        = $idautorrelacion;
                                    $objarcplanactividad->save();
                                    $elementosrelacionados++;
                                }
                            }}
                            if ($idtipoelemento == 1) {
                                $existearcplan = Doctrine::getTable(
                                    'DatArcDatPlan'
                                )->findByDql(
                                    "idarc = '$idarc' AND idplan = '$idplan'"
                                );
                                if (!isset($existearcplan[0]->idarc)
                                    || $existearcplan[0]->idarc == ''
                                ) {
                                    $objarcplan = new DatArcDatPlan();
                                    $objarcplan->idarc = $idarc;
                                    $objarcplan->idplan = $idplan;
                                    $objarcplan->idautorrelacion
                                        = $idautorrelacion;
                                    $objarcplan->save();
                                }
                                $existearcplanobjetivo = Doctrine::getTable(
                                    'DatArcDatPlanObjetivo'
                                )->findByDql(
                                    "idarc = '$idarc' AND idplan = '$idplan' AND idobjetivo = '$idelemento'"
                                );
                                if (!isset($existearcplanobjetivo[0]->idarc)
                                    || $existearcplanobjetivo[0]->idarc == ''
                                ) {
                                    $objarcplanobjetivo
                                        = new DatArcDatPlanObjetivo();
                                    $objarcplanobjetivo->idarc = $idarc;
                                    $objarcplanobjetivo->idplan = $idplan;
                                    $objarcplanobjetivo->idobjetivo
                                        = $idelemento;
                                    $objarcplanobjetivo->idautor
                                        = $idautorrelacion;
                                    $objarcplanobjetivo->save();
                                    $elementosrelacionados++;
                                }
                            }
                            break;
                        case 6:
                            $origen = 3;
                            $objelementoselementos
                                = new DatElementosDatElementos();
                            $objelementoselementos->idelementopadre
                                = $iddesviacion;
                            $objelementoselementos->idelementohijo
                                = $idelemento;
                            $objelementoselementos->origen = $origen;
                            $objelementoselementos->idautor = $idautorrelacion;
                            $objelementoselementos->save();
                            $elementosrelacionados++;
                            break;
                        case 3:
                            $origen = $elementorelacionado->origen;
                            $objelementoselementos
                                = new DatElementosDatElementos();
                            $objelementoselementos->idelementopadre
                                = $idactividad;
                            $objelementoselementos->idelementohijo
                                = $idelemento;

                            if ($origen == 7) {
                                $objelementoselementos->porcientoinicio
                                    = $elementorelacionado->porcientoinicio;
                            }
                            $objelementoselementos->origen = $origen;
                            $objelementoselementos->idautor = $idautorrelacion;
                            $objelementoselementos->save();
                            $elementosrelacionados++;
                            break;
                        default:
                            if ($idtipoelemento == 5) {
                                if($idelemento!=''){
                                  $existearcplan = Doctrine::getTable(
                                    'DatArcDatPlan'
                                  )->findByDql(
                                    "idarc = '$idelemento' AND idplan = '$idplan'"
                                  );
                                }else{
                                  $existearcplan=array();
                                }

                                if (!isset($existearcplan[0]->idarc)
                                    || $existearcplan[0]->idarc == ''
                                ) {
                                    $objarcplan = new DatArcDatPlan();
                                    $objarcplan->idarc = $idelemento;
                                    $objarcplan->idplan = $idplan;
                                    $objarcplan->idautorrelacion
                                        = $idautorrelacion;
                                    $objarcplan->save();
                                    $elementosrelacionados++;
                                }
                            } else {
                                $idelementopadre = $idelemento;
                                $idelementohijo = $elementorelacionado->idplan;
                                if ($parentrelacidelemento == 'hijo') {
                                    $idelementopadre
                                        = $elementorelacionado->idplan;
                                    $idelementohijo = $idelemento;
                                }
                                if ($elementorelacionado->tipoelemento == 1) {
                                    $idelementopadre = $idelemento;
                                    $idelementohijo
                                        = $elementorelacionado->idobjetivo;
                                    if ($parentrelacidelemento == 'hijo') {
                                        $idelementopadre
                                            = $elementorelacionado->idobjetivo;
                                        $idelementohijo = $idelemento;
                                    }
                                }
                                if ($elementorelacionado->tipoelemento == 2) {
                                    $idelementopadre = $idelemento;
                                    $idelementohijo
                                        = $elementorelacionado->idfip;
                                    if ($parentrelacidelemento == 'hijo') {
                                        $idelementopadre
                                            = $elementorelacionado->idfip;
                                        $idelementohijo = $idelemento;
                                    }
                                }
                                if (!empty($idelementopadre)
                                    && !empty($idelementohijo)
                                ) {
                                    $existerelacion = Doctrine::getTable(
                                        'DatElementosDatElementos'
                                    )->findByDql(
                                        "idelementopadre = '$idelementopadre'
                                        AND idelementohijo = '$idelementohijo'"
                                    );
                                    if (!isset($existerelacion[0]->idelementopadre)
                                        || $existerelacion[0]->idelementopadre
                                        == ''
                                    ) {
                                        $objjelemento = Doctrine::getTable(
                                            'DatElementos'
                                        )->find($idelemento);
                                        $origen = 1;
                                        if ($elementorelacionado->idautorelemento
                                            != $objjelemento->idusuariocrea
                                            /* $idautorrelacion */ AND
                                            $elementorelacionado->tipoelemento
                                            == $objjelemento->idtipoelemento
                                        ) {
                                            $origen = 2;
                                        }
                                        if ($elementorelacionado->idautorelemento
                                            != $objjelemento->idusuariocrea
                                            /* $idautorrelacion */ AND
                                            $elementorelacionado->tipoelemento
                                            != $objjelemento->idtipoelemento
                                        ) {
                                            $origen = 3;
                                        }
                                        $objelementoselementos
                                            = new DatElementosDatElementos();
                                        $objelementoselementos->idelementopadre
                                            = $idelementopadre;
                                        $objelementoselementos->idelementohijo
                                            = $idelementohijo;
                                        $objelementoselementos->origen
                                            = $origen;
                                        $objelementoselementos->idautor
                                            = $idautorrelacion;

                                        $objelementoselementos->save();
                                        $elementosrelacionados++;
                                    }
                                }
                            }
                    }
                }

                if ($elementosrelacionados == 0) {
                    $respuesta = 3;
                } else {
                    if ($elementosrelacionados == count(
                            $arrayelementosrelacionados
                        )
                    ) {
                        $respuesta = 1;
                    } else {
                        $respuesta = 2;
                    }
                }
            }
        }
        return $respuesta;
    }

    /**
     *
     */
    public function CargarRelacionesSuperiores(
        $tipoelemento, $idelemento, $idusuariosession
    ) {
        $cont = 0;
        switch ($tipoelemento) {
            case 5:
                $relacionesplanarc = DatArcDatPlan::ExisteAreaEnPlan(
                    $idelemento
                );
                $tipo = 0;
                if (isset($relacionesplanarc[0])) {
                    foreach ($relacionesplanarc as $arcplan) {
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $arcplan['idplan']
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $arcplan['idplan']
                        );
                        if (isset($objelemento->idelemento)) {
                            $eliminar = 0;
                            $superior = 1;
                            if ($idusuariosession
                                == $arcplan['idautorrelacion']
                            ) {
                                $eliminar = 1;
                                $superior = 0;
                            }
                            $arrayrelaarcplan[$cont]['idrelacion'] = $idelemento
                                . $arcplan['idplan'];
                            $arrayrelaarcplan[$cont]['idplan']
                                = $arcplan['idplan'];
                            $arrayrelaarcplan[$cont]['idarc'] = null;
                            $arrayrelaarcplan[$cont]['idobjetivo'] = null;
                            $arrayrelaarcplan[$cont]['idactividad'] = null;
                            $arrayrelaarcplan[$cont]['idfip'] = null;
                            $arrayrelaarcplan[$cont]['denominacion']
                                = $objelemento->denelemento . '*' . $tipo;
                            $arrayrelaarcplan[$cont]['idautorelemento']
                                = $objelemento->idusuariocrea;
                            $arrayrelaarcplan[$cont]['idautorrelacion']
                                = $arcplan['idautorrelacion'];
                            $arrayrelaarcplan[$cont]['autorelemento']
                                = $this->integrator->seguridad->nombreUsuario(
                                $objelemento->idusuariocrea
                            );
                            $arrayrelaarcplan[$cont]['autorrelacion']
                                = $this->integrator->seguridad->nombreUsuario(
                                $arcplan['idautorrelacion']
                            );
                            $arrayrelaarcplan[$cont]['tipoelemento'] = $tipo;
                            $arrayrelaarcplan[$cont]['eliminar'] = $eliminar;
                            $arrayrelaarcplan[$cont]['superior'] = $superior;
                            $cont++;
                        }
                    }
                    $data['contador'] = $cont;
                    $data['array'] = $arrayrelaarcplan;
                }
                return $data;
                break;
            case 3:
                //busco las relaciones binarias
                $arrayrelaciones
                    = DatElementosDatElementos::CargarGridRelaciones(
                    $idelemento
                );
                if (isset($arrayrelaciones[0])) {
                    foreach ($arrayrelaciones as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementopadre = $relacion['idelementopadre'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementopadre
                        );
                        $tipo = $objelemento->idtipoelemento;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $idplan = null;
                        $idarc = null;
                        $idobjetivo = null;
                        $idactividad = null;
                        $idfip = null;
                        $iddesviacion = null;
                        switch ($tipo) {
                            case 0:
                                $idplan = $objelemento->idelemento;
                                break;
                            case 1:
                                $idobjetivo = $objelemento->idelemento;
                                break;
                            case 2:
                                $idfip = $objelemento->idelemento;
                                break;
                            case 3:
                                $idactividad = $objelemento->idelemento;
                                break;
                            case 6:
                                $iddesviacion = $objelemento->idelemento;
                                break;
                        }
                        $arrayrelac[$cont]['idrelacion'] = $idelemento
                            . $objelemento->idelemento;
                        $arrayrelac[$cont]['idplan'] = $idplan;
                        $arrayrelac[$cont]['idarc'] = $idarc;
                        $arrayrelac[$cont]['idobjetivo'] = $idobjetivo;
                        $arrayrelac[$cont]['idactividad'] = $idactividad;
                        $arrayrelac[$cont]['iddesviacion'] = $iddesviacion;
                        $arrayrelac[$cont]['idfip'] = $idfip;
                        $arrayrelac[$cont]['origen'] = $relacion['origen'];
                        $arrayrelac[$cont]['porcientoinicio']
                            = ($relacion['origen'] == 7)
                            ? $relacion['porcientoinicio'] : null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                //busco las relaciones ternarias
                $arrayrelplanarcact
                    = DatArcDatPlanActividades::ObtenerRelacionPlanArcActByAct(
                    $idelemento
                );
                if (isset($arrayrelplanarcact[0])) {
                    foreach ($arrayrelplanarcact as $planactarc) {
                        $idautorrelacion = $planactarc['idautor'];
                        $tipo = 50;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $planactarc['idplan']
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $planactarc['idplan']
                        );
                        $objarc = Doctrine::getTable('DatArc')->find(
                            $planactarc['idarc']
                        );
                        $arrayrelac[$cont]['idrelacion'] = $idelemento
                            . $objplan->idplan . $objarc->idarc;
                        $arrayrelac[$cont]['idplan'] = $objplan->idplan;
                        $arrayrelac[$cont]['idarc'] = $objarc->idarc;
                        $arrayrelac[$cont]['idobjetivo'] = null;
                        $arrayrelac[$cont]['idactividad'] = null;
                        $arrayrelac[$cont]['idfip'] = null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo . '*'
                            . $objarc->denarc;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                                $objelemento->idusuariocrea
                            ) . '*' . $tipo . '*'
                            . $this->integrator->seguridad->nombreUsuario(
                                $objarc->idusuariocrea
                            );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            $idautorrelacion
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;
                return $data;
                break;
            case 1:
                //busco las relaciones binarias
                $arrayrelaciones
                    = DatElementosDatElementos::CargarGridRelaciones(
                    $idelemento
                );
                if (isset($arrayrelaciones[0])) {
                    foreach ($arrayrelaciones as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementopadre = $relacion['idelementopadre'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementopadre
                        );
                        $tipo = $objelemento->idtipoelemento;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $idplan = null;
                        $idarc = null;
                        $idobjetivo = null;
                        $idactividad = null;
                        $idfip = null;
                        switch ($tipo) {
                            case 0:
                                $idplan = $objelemento->idelemento;
                                break;
                            case 1:
                                $idobjetivo = $objelemento->idelemento;
                                break;
                            case 2:
                                $idfip = $objelemento->idelemento;
                                break;
                        }
                        $arrayrelac[$cont]['idrelacion'] = $idelemento
                            . $objelemento->idelemento;
                        $arrayrelac[$cont]['idplan'] = $idplan;
                        $arrayrelac[$cont]['idarc'] = $idarc;
                        $arrayrelac[$cont]['idobjetivo'] = $idobjetivo;
                        $arrayrelac[$cont]['idactividad'] = $idactividad;
                        $arrayrelac[$cont]['idfip'] = $idfip;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                //busco las relaciones ternarias
                $arrayrelplanarcobj
                    = DatArcDatPlanObjetivo::ObtenerRelacionPlanArcObjByObj(
                    $idelemento
                );
                if (isset($arrayrelplanarcobj[0])) {
                    foreach ($arrayrelplanarcobj as $planactobj) {
                        $idautorrelacion = $planactobj['idautor'];
                        $tipo = 50;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $planactobj['idplan']
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $planactobj['idplan']
                        );
                        $objarc = Doctrine::getTable('DatArc')->find(
                            $planactobj['idarc']
                        );

                        $arrayrelac[$cont]['idrelacion'] = $idelemento
                            . $objplan->idplan . $objarc->idarc;
                        $arrayrelac[$cont]['idplan'] = $objplan->idplan;
                        $arrayrelac[$cont]['idarc'] = $objarc->idarc;
                        $arrayrelac[$cont]['idobjetivo'] = null;
                        $arrayrelac[$cont]['idactividad'] = null;
                        $arrayrelac[$cont]['idfip'] = null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo . '*'
                            . $objarc->denarc;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                                $objelemento->idusuariocrea
                            ) . '*' . $tipo . '*'
                            . $this->integrator->seguridad->nombreUsuario(
                                $objarc->idusuariocrea
                            );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            $idautorrelacion
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;
                return $data;
                break;
        }
    }

    public function CargarRelacionesSuperioresPaginado(
        $tipoelemento, $idelemento, $idusuariosession, $limit, $start
    )
    {
        $cont = 0;
        switch ($tipoelemento) {
            case 5:
                $relacionesplanarc = DatArcDatPlan::ExisteAreaEnPlan(
                    $idelemento
                );
                $tipo = 0;
                if (isset($relacionesplanarc[0])) {
                    foreach ($relacionesplanarc as $arcplan) {
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $arcplan['idplan']
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $arcplan['idplan']
                        );
                        if (isset($objelemento->idelemento)) {
                            $eliminar = 0;
                            $superior = 1;
                            if ($idusuariosession
                                == $arcplan['idautorrelacion']
                            ) {
                                $eliminar = 1;
                                $superior = 0;
                            }
                            $arrayrelaarcplan[$cont]['idrelacion'] = $idelemento
                                . $arcplan['idplan'];
                            $arrayrelaarcplan[$cont]['idplan']
                                = $arcplan['idplan'];
                            $arrayrelaarcplan[$cont]['idarc'] = null;
                            $arrayrelaarcplan[$cont]['idobjetivo'] = null;
                            $arrayrelaarcplan[$cont]['idactividad'] = null;
                            $arrayrelaarcplan[$cont]['idfip'] = null;
                            $arrayrelac[$cont]['iddesviacion'] = null;
                            $arrayrelaarcplan[$cont]['denominacion']
                                = $objelemento->denelemento . '*' . $tipo;
                            $arrayrelaarcplan[$cont]['idautorelemento']
                                = $objelemento->idusuariocrea;
                            $arrayrelaarcplan[$cont]['idautorrelacion']
                                = $arcplan['idautorrelacion'];
                            $arrayrelaarcplan[$cont]['autorelemento']
                                = $this->integrator->seguridad->nombreUsuario(
                                $objelemento->idusuariocrea
                            );
                            $arrayrelaarcplan[$cont]['autorrelacion']
                                = $this->integrator->seguridad->nombreUsuario(
                                $arcplan['idautorrelacion']
                            );
                            $arrayrelaarcplan[$cont]['tipoelemento'] = $tipo;
                            $arrayrelaarcplan[$cont]['eliminar'] = $eliminar;
                            $arrayrelaarcplan[$cont]['superior'] = $superior;
                            $cont++;
                        }
                    }
                    $data['contador'] = $cont;
                    $data['array'] = $arrayrelaarcplan;
                }
                return $data;
                break;
            case 3:
                //busco las relaciones binarias
                $arrayrelaciones
                    = DatElementosDatElementos::CargarGridRelaciones(
                    $idelemento
                );
                $arrayrelacionesb
                    = DatElementosDatElementos::CargarGridRelacionesDependencias(
                    $idelemento
                );
                if (isset($arrayrelaciones[0])) {
                    foreach ($arrayrelaciones as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementopadre = $relacion['idelementopadre'];
                        $idelementohijo = $relacion['idelementohijo'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementopadre
                        );
                        $tipo = $objelemento->idtipoelemento;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $idplan = null;
                        $idarc = null;
                        $idobjetivo = null;
                        $idactividad = null;
                        $idfip = null;
                        $iddesviacion = null;
                        switch ($tipo) {
                            case 0:
                                $idplan = $objelemento->idelemento;
                                break;
                            case 1:
                                $idobjetivo = $objelemento->idelemento;
                                break;
                            case 2:
                                $idfip = $objelemento->idelemento;
                                break;
                            case 6:
                                $iddesviacion = $objelemento->idelemento;
                                break;
                            case 3:
                                $idactividad = $objelemento->idelemento;
                                break;
                        }
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objelemento->idelemento;
                        $arrayrelac[$cont]['idplan'] = $idplan;
                        $arrayrelac[$cont]['idarc'] = $idarc;
                        $arrayrelac[$cont]['idobjetivo'] = $idobjetivo;
                        $arrayrelac[$cont]['depende'] = ($relacion['origen']
                            == 8) ? 1 : 0;
                        $arrayrelac[$cont]['origen'] = $relacion['origen'];
                        $arrayrelac[$cont]['porcientoinicio']
                            = ($relacion['origen'] == 7)
                            ? $relacion['porcientoinicio'] : null;
                        $arrayrelac[$cont]['idactividad'] = $idactividad;
                        $arrayrelac[$cont]['idfip'] = $idfip;
                        $arrayrelac[$cont]['iddesviacion'] = $iddesviacion;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                if (isset($arrayrelacionesb[0])) {
                    foreach ($arrayrelacionesb as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementohijo = $relacion['idelementohijo'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementohijo
                        );
                        $tipo = $objelemento->idtipoelemento;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $idplan = null;
                        $idarc = null;
                        $idobjetivo = null;
                        $idactividad = null;
                        $idfip = null;
                        $iddesviacion = null;
                        switch ($tipo) {
                            case 0:
                                $idplan = $objelemento->idelemento;
                                break;
                            case 1:
                                $idobjetivo = $objelemento->idelemento;
                                break;
                            case 2:
                                $idfip = $objelemento->idelemento;
                                break;
                            case 6:
                                $iddesviacion = $objelemento->idelemento;
                                break;
                            case 3:
                                $idactividad = $objelemento->idelemento;
                                break;
                        }
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objelemento->idelemento;
                        $arrayrelac[$cont]['idplan'] = $idplan;
                        $arrayrelac[$cont]['idarc'] = $idarc;
                        $arrayrelac[$cont]['idobjetivo'] = $idobjetivo;
                        $arrayrelac[$cont]['depende'] = 1;
                        $arrayrelac[$cont]['origen'] = $relacion['origen'];
                        $arrayrelac[$cont]['porcientoinicio']
                            = ($relacion['origen'] == 7)
                            ? $relacion['porcientoinicio'] : null;
                        $arrayrelac[$cont]['idactividad'] = $idactividad;
                        $arrayrelac[$cont]['idfip'] = $idfip;
                        $arrayrelac[$cont]['iddesviacion'] = $iddesviacion;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                //busco las relaciones ternarias
                $arrayrelplanarcact
                    = DatArcDatPlanActividades::ObtenerRelacionPlanArcActByAct(
                    $idelemento
                );
                if (isset($arrayrelplanarcact[0])) {
                    foreach ($arrayrelplanarcact as $planactarc) {
                        $idautorrelacion = $planactarc['idautor'];
                        $tipo = 50;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $planactarc['idplan']
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $planactarc['idplan']
                        );
                        $objarc = Doctrine::getTable('DatArc')->find(
                            $planactarc['idarc']
                        );
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objplan->idplan . $objarc->idarc;
                        $arrayrelac[$cont]['idplan'] = $objplan->idplan;
                        $arrayrelac[$cont]['idarc'] = $objarc->idarc;
                        $arrayrelac[$cont]['idobjetivo'] = null;
                        $arrayrelac[$cont]['idactividad'] = null;
                        $arrayrelac[$cont]['idfip'] = null;
                        $arrayrelac[$cont]['iddesviacion'] = null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo . '*'
                            . $objarc->denarc;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                                $objelemento->idusuariocrea
                            ) . '*' . $tipo . '*'
                            . $this->integrator->seguridad->nombreUsuario(
                                $objarc->idusuariocrea
                            );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            $idautorrelacion
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;
                return $data;
                break;
            case 1:
                //busco las relaciones binarias
                $arrayrelaciones
                    = DatElementosDatElementos::CargarGridRelaciones(
                    $idelemento
                );
                if (isset($arrayrelaciones[0])) {
                    foreach ($arrayrelaciones as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementopadre = $relacion['idelementopadre'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementopadre
                        );
                        $tipo = $objelemento->idtipoelemento;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $idplan = null;
                        $idarc = null;
                        $idobjetivo = null;
                        $idactividad = null;
                        $idfip = null;
                        $iddesviacion = null;
                        switch ($tipo) {
                            case 0:
                                $idplan = $objelemento->idelemento;
                                break;
                            case 1:
                                $idobjetivo = $objelemento->idelemento;
                                break;
                            case 2:
                                $idfip = $objelemento->idelemento;
                                break;
                            case 6:
                                $iddesviacion = $objelemento->idelemento;
                                break;
                        }
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objelemento->idelemento;
                        $arrayrelac[$cont]['idplan'] = $idplan;
                        $arrayrelac[$cont]['idarc'] = $idarc;
                        $arrayrelac[$cont]['idobjetivo'] = $idobjetivo;
                        $arrayrelac[$cont]['idactividad'] = $idactividad;
                        $arrayrelac[$cont]['idfip'] = $idfip;
                        $arrayrelac[$cont]['iddesviacion'] = $iddesviacion;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                //busco las relaciones ternarias
                $arrayrelplanarcobj
                    = DatArcDatPlanObjetivo::ObtenerRelacionPlanArcObjByObj(
                    $idelemento
                );
                if (isset($arrayrelplanarcobj[0])) {
                    foreach ($arrayrelplanarcobj as $planactobj) {
                        $idautorrelacion = $planactobj['idautor'];
                        $tipo = 50;
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $planactobj['idplan']
                        );
                        $objplan = Doctrine::getTable('DatPlanPdo')->find(
                            $planactobj['idplan']
                        );
                        $objarc = Doctrine::getTable('DatArc')->find(
                            $planactobj['idarc']
                        );
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objplan->idplan . $objarc->idarc;
                        $arrayrelac[$cont]['idplan'] = $objplan->idplan;
                        $arrayrelac[$cont]['idarc'] = $objarc->idarc;
                        $arrayrelac[$cont]['idobjetivo'] = null;
                        $arrayrelac[$cont]['idactividad'] = null;
                        $arrayrelac[$cont]['idfip'] = null;
                        $arrayrelac[$cont]['iddesviacion'] = null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo . '*'
                            . $objarc->denarc;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                                $objelemento->idusuariocrea
                            ) . '*' . $tipo . '*'
                            . $this->integrator->seguridad->nombreUsuario(
                                $objarc->idusuariocrea
                            );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            $idautorrelacion
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }
                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;
                return $data;
                break;
            case 10: //si es tarea
                //dependencias
                $arrayrelacionesb
                    = DatElementosDatElementos::cargarRelacionesDependencias(
                    $idelemento
                );
                if (isset($arrayrelacionesb[0])) {
                    foreach ($arrayrelacionesb as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementoa = $relacion['idelementopadre'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementoa
                        );
                        //Saber si es plantilla
                        $plantilla = DatElementos::tareaEsPlantilla(
                            $idelemento
                        );
                        if ($plantilla[0] == 1) {
                            $tipo = $objelemento->idtipoelemento . '0';
                        } else {
                            $tipo = $objelemento->idtipoelemento;
                        }
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }
                        if ($relacion['origen'] > 5) {
                            $depende = 1;
                        } else {
                            $depende = 0;
                        }
                        $idproyecto = null;
                        $idhito = null;
                        $idtarea = null;
                        switch ($tipo) {
                            case 8:
                                $idproyecto = $objelemento->idelemento;
                                break;
                            case 9:
                                $idhito = $objelemento->idelemento;
                                break;
                            case 10:
                                $idtarea = $objelemento->idelemento;
                                break;
                            //Plantilla
                            case 80:
                                $idproyecto = $objelemento->idelemento;
                                break;
                            case 90:
                                $idhito = $objelemento->idelemento;
                                break;
                            case 100:
                                $idtarea = $objelemento->idelemento;
                                break;

                        }
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objelemento->idelemento;
                        $arrayrelac[$cont]['idproyecto'] = $idproyecto;
                        $arrayrelac[$cont]['idhito'] = $idhito;
                        $arrayrelac[$cont]['idtarea'] = $idtarea;
                        $arrayrelac[$cont]['depende'] = $depende;
                        $arrayrelac[$cont]['origen'] = $relacion['origen'];
                        $arrayrelac[$cont]['porcientoinicio']
                            = ($relacion['origen'] == 7)
                            ? $relacion['porcientoinicio'] : null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }

                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;
                return $data;
                break;
            case 9:
                $arrayrelacionesb
                    = DatElementosDatElementos::cargarRelacionesDependencias(
                    $idelemento
                );
                //print_r($arrayrelacionesb);die;
                if (isset($arrayrelacionesb[0])) {
                    foreach ($arrayrelacionesb as $relacion) {
                        $idautorrelacion = $relacion['idautor'];
                        $idelementoa = $relacion['idelementopadre'];
                        $objelemento = Doctrine::getTable('DatElementos')->find(
                            $idelementoa
                        );
                        //Saber si es plantilla
                        $plantilla = DatElementos::hitoEsPlantilla($idelemento);
                        if ($plantilla[0] == 1) {
                            $tipo = $objelemento->idtipoelemento . '0';
                        } else {
                            $tipo = $objelemento->idtipoelemento;
                        }
                        $eliminar = 1;
                        $superior = 0;
                        if ($idusuariosession != $idautorrelacion) {
                            $eliminar = 0;
                            $superior = 1;
                        }

                        switch ($tipo) {
                            case 8:
                                $idproyecto = $objelemento->idelemento;
                                break;
                        }
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objelemento->idelemento;
                        $arrayrelac[$cont]['idproyecto'] = $idproyecto;
                        $arrayrelac[$cont]['depende'] = 0;
                        $arrayrelac[$cont]['origen'] = $relacion['origen'];
                        $arrayrelac[$cont]['porcientoinicio']
                            = ($relacion['origen'] == 7)
                            ? $relacion['porcientoinicio'] : null;
                        $arrayrelac[$cont]['denominacion']
                            = $objelemento->denelemento . '*' . $tipo;
                        $arrayrelac[$cont]['idautorelemento']
                            = $objelemento->idusuariocrea;
                        $arrayrelac[$cont]['idautorrelacion']
                            = $idautorrelacion;
                        $arrayrelac[$cont]['autorelemento']
                            = $this->integrator->seguridad->nombreUsuario(
                            $objelemento->idusuariocrea
                        );
                        $arrayrelac[$cont]['autorrelacion']
                            = $this->integrator->seguridad->nombreUsuario(
                            ($idautorrelacion)
                        );
                        $arrayrelac[$cont]['tipoelemento'] = $tipo;
                        $arrayrelac[$cont]['eliminar'] = $eliminar;
                        $arrayrelac[$cont]['superior'] = $superior;
                        $cont++;
                    }
                }

                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;

                return $data;
                break;
        }
    }

    /**
     *
     */
    public function EliminarRelacionesSuperiores(
        $tipoelemento, $idelemento, $arrayrelacionesseleccionadas
    ) {
        $contrelnoexistentes = 0;
        $procede = 1;
        switch ($tipoelemento) {
            case 5:
                $existearc = Doctrine::getTable('DatArc')->find($idelemento);
                if (!isset($existearc->idarc)) {
                    $respuesta = 0; //no existe el arc
                    $procede = 0;
                }
                break;
                $existearc = Doctrine::getTable('DatArc')->find($idelemento);
                if (!isset($existearc->idarc)) {
                    $respuesta = 0; //no existe el arc
                    $procede = 0;
                }
            default:
                $existeelemento = Doctrine::getTable('DatElementos')->find(
                    $idelemento
                );
                if (!isset($existeelemento->idelemento)) {
                    $respuesta = 0; //no existe el elemento
                    $procede = 0;
                }
        }
        if ($procede == 1) {
            foreach ($arrayrelacionesseleccionadas as $key => $relacion) {
                $tipoelementorelacionado = $relacion->tipoelemento;
                switch ($tipoelementorelacionado) {
                    case 50:
                        $idarc = $relacion->idarc;
                        $idplan = $relacion->idplan;
                        if ($tipoelemento == 3) {
                            $relacionarcplanact = Doctrine::getTable(
                                'DatArcDatPlanActividades'
                            )->findByDql(
                                "idplan = $idplan AND idarc = $idarc 
                                    AND idactividad = $idelemento"
                            );
                        } else {
                            $relacionarcplanact = Doctrine::getTable(
                                'DatArcDatPlanObjetivo'
                            )->findByDql(
                                "idplan = $idplan AND idarc = $idarc 
                                    AND idobjetivo = $idelemento"
                            );
                        }
                        if (isset($relacionarcplanact[0]->idplan)
                            && $relacionarcplanact[0]->idplan != ''
                        ) {
                            $relacionarcplanact->delete();
                        } else {
                            $contrelnoexistentes++;
                        }
                        break;
                    case 0:
                        $idplan = $relacion->idplan;
                        if ($tipoelemento == 5) {
                            $existerelacion = Doctrine::getTable(
                                'DatArcDatPlan'
                            )->findByDql(
                                "idarc = $idelemento AND idplan = $idplan"
                            );
                            if (isset($existerelacion[0]->idplan)
                                && $existerelacion[0]->idplan != ''
                            ) {
                                $existerelacion->delete();
                            } else {
                                $contrelnoexistentes++;
                            }
                        } else {
                            $existerelacion = Doctrine::getTable(
                                'DatElementosDatElementos'
                            )->findByDql(
                                "idelementopadre = $idplan 
                                    AND idelementohijo = $idelemento"
                            );
                            if (isset($existerelacion[0]->idelementopadre)
                                && $existerelacion[0]->idelementopadre != ''
                            ) {
                                $existerelacion->delete();
                            } else {
                                $contrelnoexistentes++;
                            }
                        }
                        break;
                    case 1:
                        $idobjetivo = $relacion->idobjetivo;
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idobjetivo 
                                AND idelementohijo = $idelemento"
                        );
                        if (isset($existerelacion[0]->idelementopadre)
                            && $existerelacion[0]->idelementopadre != ''
                        ) {
                            $existerelacion->delete();
                        } else {
                            $contrelnoexistentes++;
                        }
                        break;
                    case 6:
                        $iddesviacion = $relacion->iddesviacion;
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $iddesviacion 
                                AND idelementohijo = $idelemento"
                        );
                        if (isset($existerelacion[0]->idelementopadre)
                            && $existerelacion[0]->idelementopadre != ''
                        ) {
                            $existerelacion->delete();
                        } else {
                            $contrelnoexistentes++;
                        }
                        break;
                    case 2:
                        $idfip = $relacion->idfip;
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idfip 
                                AND idelementohijo = $idelemento"
                        );
                        if (isset($existerelacion[0]->idelementopadre)
                            && $existerelacion[0]->idelementopadre != ''
                        ) {
                            $existerelacion->delete();
                        } else {
                            $contrelnoexistentes++;
                        }
                        break;
                    case 3:
                        $idactividad = $relacion->idactividad;
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idactividad 
                                AND idelementohijo = $idelemento"
                        );
                        $existerelacionn = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idelemento 
                                AND idelementohijo = $idactividad"
                        );
                        if (isset($existerelacion[0]->idelementopadre)
                            && $existerelacion[0]->idelementopadre != ''
                        ) {
                            $existerelacion->delete();
                        } else {
                            if (isset($existerelacionn[0]->idelementopadre)
                                && $existerelacionn[0]->idelementopadre != ''
                            ) {
                                $existerelacionn->delete();
                            } else {
                                $contrelnoexistentes++;
                            }
                        }
                        break;
                    case 10:
                        $idtarea = $relacion->idtarea;
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idtarea
                                AND idelementohijo = $idelemento"
                        );
                        $existerelacionn = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idelemento
                                AND idelementohijo = $idtarea"
                        );
                        if (isset($existerelacion[0]->idelementopadre)
                            && $existerelacion[0]->idelementopadre != ''
                        ) {
                            $existerelacion->delete();
                        } else {
                            if (isset($existerelacionn[0]->idelementopadre)
                                && $existerelacionn[0]->idelementopadre != ''
                            ) {
                                $existerelacionn->delete();
                            } else {
                                $contrelnoexistentes++;
                            }
                        }
                        break;
                    case 100:
                        $idtarea = $relacion->idtarea;
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idtarea
                                AND idelementohijo = $idelemento"
                        );
                        $existerelacionn = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = $idelemento
                                AND idelementohijo = $idtarea"
                        );
                        if (isset($existerelacion[0]->idelementopadre)
                            && $existerelacion[0]->idelementopadre != ''
                        ) {
                            $existerelacion->delete();
                        } else {
                            if (isset($existerelacionn[0]->idelementopadre)
                                && $existerelacionn[0]->idelementopadre != ''
                            ) {
                                $existerelacionn->delete();
                            } else {
                                $contrelnoexistentes++;
                            }
                        }
                        break;
                }
                $totalrelaciones = $key + 1;
                $respuesta = 2; //relaciones eliminadas correctamentes
                if ($contrelnoexistentes == 0) {
                    if ($totalrelaciones == 1) {
                        $respuesta = 1;
                    }//relacion eliminada correctamente
                } else {
                    if ($totalrelaciones == 1) {
                        $respuesta = 3;
                    }//no existe la relacion
                }
            }
        }
        return $respuesta;
    }

}

