<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatObjetivoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(
        DatObjetivo $datObjetivo, $idElementoPadre, $idUsuario
    ) {
        //salvo el objeto objetivo
        $datObjetivo->save();
        if ($idElementoPadre) {//si tiene padre
            //obtengo objetivo padre
            $elementoP = DatElementos::Buscar($idElementoPadre);
            //creo objeto dat_elemento_dat_elemento y seteo datos
            $datDlementoDatElemento = new DatElementosDatElementos();
            $datDlementoDatElemento->idelementopadre
                = $elementoP->idelemento;
            $datDlementoDatElemento->idelementohijo
                = $datObjetivo->idobjetivo;
            $datDlementoDatElemento->origen = ($idUsuario
            == $elementoP->idusuariocrea ? 0 : 3);
            //inserto obj dat_elemento_dat_elemento
            $datDlementoDatElemento->save();
        }
    }

    public function Actualizar(DatObjetivo $datObjetivo)
    {
        $datObjetivo->save();
    }

    public function Eliminar(DatObjetivo $datObjetivo)
    {
        $datObjetivo->delete();
    }

    public function EliminarObjetivo($idElemento)
    {
        //obtengo el Elemento
        $elemento = DatElementos::Buscar($idElemento);
        //obtengo el Objetivo
        $objetivo = DatObjetivo::Buscar($idElemento);
        //obtener los hijos del objetivo
        $elementHijos = DatElementosDatElementos::BuscarElementosHijo(
            $idElemento
        );
        if ($elementHijos) {
            foreach ($elementHijos as $hijo) {
                if ($hijo['origen'] == 0
                    || $hijo['origen'] == 3
                ) {//Elimino hijo
                    DatObjetivoModel::EliminarObjetivo($hijo['idelementohijo']);
                } else {
                    DatElementosDatElementos::Eliminar(
                        $idElemento, $hijo['idelementohijo']
                    );
                }
            }
        }
        //obtengo todas las relaciones del objetivo con involucrado
        $listaRelaciones = DatObjetivoModel::RelacionesInvolucradoObjetivo(
            $idElemento
        );
        if ($listaRelaciones) {
            //elimino todos los involucrados en el objetivo
            foreach ($listaRelaciones as $relacion) {
                DatObjetivoModel::EliminarInvolucradoElemento(
                    $relacion['idelemento'], $relacion['idinvolucrado']
                );
            }
        }
        //obtengo las relaciones con arc y fip para eliminar
        $listDeRelaciones = DatObjetivoModel::cargarGridRelaciones(
            $idElemento
        );
        //convierto el arreglo de arreglos a arreglo de stdClass
        $listDeRelaciones = json_encode($listDeRelaciones);
        $listDeRelaciones = json_decode($listDeRelaciones);
        DatObjetivoModel::eliminarRelaciones(
            $listDeRelaciones, $idElemento, $m
        );
        //elimino todas las observaciones
        DatObservacionesPdo::EliminarObservPorIdElemento($idElemento);
        //obtener elemento padre
        $elementoPadre = DatObjetivoModel::ObjetivoPadre($idElemento);
        if ($elementoPadre) {//si tiene padre eliminar su relacion en 
            // la tabla dat_elemento_dat_elemento
            DatElementosDatElementos::Eliminar(
                $elementoPadre->idelemento, $idElemento
            );
        }
        //busco la relacion elemento nomenclador
        $datElementDatNomenclador
            = DatElementosNomNomenclador::GetElementoNomenclador($idElemento);
        if ($datElementDatNomenclador) {
            DatElementosNomNomencladorModel::Eliminar(
                $datElementDatNomenclador
            );
        }
        //elimino el Objetivo
        DatObjetivoModel::Eliminar($objetivo);
        //elimino el Elemento
        DatElementosModel::Eliminar($elemento);
    }

    public function BuscarObjetivos($parametros)
    {
        //realizar la busqueda
        $listObj = DatObjetivo::buscarObj($parametros);
        return $listObj;
    }

    public function RelacionesInvolucradoObjetivo($idElemento)
    {
        //obtengo todas las relaciones involucrado objetivo
        return DatElementosDatInvolucrados::GetInvolucradosPorIdElemento(
            $idElemento
        );
    }

    public function EliminarInvolucradoElemento($idElemento, $idinvolucrado)
    {
        //elimino la relacion involucrados objetivo
        DatElementosDatInvolucrados::EliminarRelInvoElem(
            $idElemento, $idinvolucrado
        );
    }

    public function ActivarDesactivarEnCasacada($parametros)
    {
        //optengo datos
        $idElemento = $parametros['id_elemento'];
        $idUsuarioSesion = $parametros['id_usuario_sesion'];
        $actDesact = $parametros['act_desact']; // 1 si se va a activar
        // 0 si se va a desasctivar
        //obtener el elemento
        $elemento = Doctrine::getTable('DatElementos')->find($idElemento);
        //activar elemento y actualizar
        $elemento->activo = $actDesact;
        $elemento->save();
        //obtener objetivos subordinados
        $listSubordinados = DatObjetivo::ObjetivosSubordinados($idElemento);
        //para cada subordinado activar en cascada
        foreach ($listSubordinados as $subordinado) {
            //construir la variable parametro
            $param['id_elemento'] = $subordinado['idelemento'];
            $param['id_usuario_sesion'] = $idUsuarioSesion;
            $param['act_desact'] = $actDesact;
            //invocando recursividad
            DatObjetivoModel::ActivarDesactivarEnCasacada($param);
        }
    }

    public function ObjetivoPadre($idElemento)
    {
        //obtengo el id del padre del objetivo
        $aux = DatObjetivo::IdPadreIdHijo($idElemento);
        //obtengo padre
        $elemento = Doctrine::getTable('DatElementos')->find(
            $aux[0]['idelementopadre']
        );
        return $elemento;
    }

    public function BuscarCriterios($idObjetivo/*, $idUsuario*/)
    {
        //obtengo lista de criterios
        $listaAuxCrit = DatCriteriomedida::GetCritDadoIdElemen($idObjetivo);
        //preparo respuesta
        $listaCriterios = array();
        $cont = 0;
        foreach ($listaAuxCrit as $crit) {
            $listaCriterios[] = array();
            $listaCriterios[$cont]['idcriteriomedida']
                = $crit['idcriteriomedida'];
            $listaCriterios[$cont]['idobjetivo'] = $crit['idobjetivo'];
            $listaCriterios[$cont]['valormeta'] = $crit['valormeta'];
            $listaCriterios[$cont]['valorreal'] = $crit['valoreal'];
            $listaCriterios[$cont]['fechainiciocrit'] = $crit['fechainicio'];
            $listaCriterios[$cont]['fechafincrit'] = $crit['fechafin'];
            $listaCriterios[$cont]['unidadmedida'] = $crit['idumedida'];
            $listaCriterios[$cont]['participantescrit']
                = $crit['participante'];
            $listaCriterios[$cont]['denelementocrit'] = $crit['dencriterio'];
            $listaCriterios[$cont]['idestadocriterio'] = $crit['idestadocump'];
            $listaCriterios[$cont]['descriterio'] = $crit['descriterio'];
            $listaCriterios[$cont]['gradocumplimientocrit']
                = $crit['gradocumplimiento'];
            $listaCriterios[$cont]['estadocumplcrit']
                = $crit['estadocumplimiento'];
            $listaCriterios[$cont]['estadocumplimientocrit']
                = $crit['estadocumplimiento'] . '(' . $crit['gradocumplimiento']
                . '%)';
            $cont++;
        }
        //envio a la controladora
        return $listaCriterios;
    }

    public function EliminarCriterio($idCriterio)
    {
        //obtengo el criterio
        $criterio = Doctrine::getTable('DatCriteriomedida')->find($idCriterio);
        //elimino las relaciones del criterio con involucrados
        DatCriterioDatInvolucrados::EliminarRelacionesDelCriterio($idCriterio);
        //elimino criterio
        DatCriteriomedidaModel::Eliminar($criterio);
    }

    public function BuscarObservaciones($idElemento)
    {
        //obtengo lista de observaciones
        $listaObservaciones = DatObservacionesPdo::GetObsDadoIdElemen(
            $idElemento
        );
        //envio a la controladora
        return $listaObservaciones;
    }

    public function EliminarObservaciones($idObservacion)
    {
        //obtengo la observacion
        $observacion = Doctrine::getTable('DatObservacionesPdo')->find(
            $idObservacion
        );
        //elimino observacion
        DatObservacionesPdoModel::Eliminar($observacion);
    }

    public function ValidarFechas(
        $idElemento, $idPadre, $fechas, &$success, &$cod, &$msg
    ) {
        if ($idPadre) {
            //obtener objetivo padre
            $objPadre = Doctrine::getTable('DatObjetivo')->find($idPadre);
            if ($objPadre) {//si tiene padre
                //comparar fechas inicial con el padre
                if ($fechas['inicio'] >= $objPadre->fechainicio
                ) { /*hacer nada */
                } else {
                    $success = false;
                    $msg
                        = "La fecha de inicio del Objetivo es anterior a la 
                            fecha de inicio del Objetivo al que se subordina";
                    $cod = 3;
                }
                //comparar fechas final con el padre
                if ($fechas['fin'] <= $objPadre->fechafin) { /*hacer nada*/
                } else {
                    if ($success) {
                        $msg
                            = "La fecha final del Objetivo es posterior a la 
                                fecha final del Objetivo al que se subordina";
                        $cod = 3;
                    } else {
                        $msg
                            = "Las fechas de inicio y fin del Objetivo son 
                                anterior y posterior respectivamente a las 
                                fecha de inicio y fin del Objetivo al que se 
                                subordina";
                        $cod = 3;
                    }
                    $success = false;
                }
            }
            if ($success) {//si no hay problemas
                //obtener hijos
                $objetivosHijos = DatObjetivo::ObjetivosSubordinados(
                    $idElemento
                );
                if ($objetivosHijos) {//si tiene hijos
                    foreach ($objetivosHijos as $hijo) {
                        //obtengo obj
                        $obj = Doctrine::getTable('DatObjetivo')->find(
                            $hijo['idelemento']
                        );
                        //creo variable fecha
                        $fechas = array('inicio' => $obj->fechainicio,
                                        'fin'    => $obj->fechafin);
                        //llamo recursivo
                        DatObjetivoModel::ValidarFechas(
                            $hijo['idelemento'], $idElemento, $fechas,
                            $success, $cod, $msg
                        );
                    }
                }
            }
        }
    }

    public function quitarRepetidos($arreglo)
    {
        $result = array();  //lista nueva
        foreach ($arreglo as $element) {
            $repetido = false;
            foreach ($result as $obj) {
                if ($element['idelemento'] == $obj) {
                    $repetido = true;
                    break;
                }
            }
            if (!$repetido) {
                $result[] = $element['idelemento'];
            }
        }
        return $result;
    }

    public function cargarGridRelaciones($idObjetivo)
    {
        $listRelaciones = array(); //lista de relaciones
        $cont = 0;                    //contador
        $listDeArc = DatObjetivo::GetARCRelacionadosConObjetivo($idObjetivo);
        foreach ($listDeArc as $arc) { //conformar la lista de relaciones
            $listRelaciones[] = array();
            $listRelaciones[$cont]['tipoelemento'] = "ARC";
            $listRelaciones[$cont]['idelemento'] = $arc['idarc'];
            $listRelaciones[$cont]['denominacion'] = $arc['denarc'];
            $listRelaciones[$cont]['descripcion'] = $arc['descrip'];
            $listRelaciones[$cont]['idautor'] = $arc['idautor'];
            $listRelaciones[$cont]['activo'] = $arc['activo'];
            $listRelaciones[$cont]['fechainicio'] = $arc['fechainicio'];
            $listRelaciones[$cont]['fechafin'] = $arc['fechafin'];
            $listRelaciones[$cont]['idarcpadre'] = $arc['idarcp'];
            $listRelaciones[$cont]['idplan'] = $arc['idplan'];
            $listRelaciones[$cont]['idobjetivo'] = $arc['idobjetivo'];
            $listRelaciones[$cont]['nombreplan'] = Doctrine::getTable(
                'DatElementos'
            )->find($arc['idplan'])->denelemento;
            $listRelaciones[$cont]['fechacreacion'] = $arc['fechacreacion'];
            $listRelaciones[$cont]['existeenBD'] = 1;
            $cont++;
        }
        $listDeFip = DatObjetivo::GetFipRelacionadosConObjetivo($idObjetivo);
        foreach ($listDeFip as $fip) { //conformar la lista de relaciones
            $listRelaciones[] = array();
            $listRelaciones[$cont]['tipoelemento'] = "FIP";
            $listRelaciones[$cont]['idelemento'] = $fip['idelemento'];
            $listRelaciones[$cont]['denominacion'] = $fip['denelemento'];
            $listRelaciones[$cont]['descripcion'] = $fip['descelemento'];
            $listRelaciones[$cont]['idautor']
                = $fip['DatElementosDatElementos']['idautor'];
            $listRelaciones[$cont]['activo'] = $fip['activo'];
            $listRelaciones[$cont]['gradocumplimiento']
                = $fip['gradocumplimiento'];
            $listRelaciones[$cont]['privado'] = $fip['privado'];
            $listRelaciones[$cont]['existeenBD'] = 1;
            $listRelaciones[$cont]['nombreplan'] = '-----------------';
            $cont++;
        }
        return $listRelaciones;
    }

    public function cargarArbolPlanUsuario($idUsuario, $node)
    {
        //construir el array a enviar a la interfas
        $result = array();
        $cont = 0;
        switch ($node) {
            case 'node1':
                $idElemento = null;
                $listPlanes = DatElementos::GetPlanesDeUsuario(
                    $idUsuario, $idElemento
                );
                foreach ($listPlanes as $plan) {
                    //buscar al padre
                    $datElemDatElem
                        = DatElementosDatElementos::BuscarElementoPadre(
                        $plan['idelemento']
                    );
                    if (!$datElemDatElem) { //si no tiene padre
                        $result[] = array();
                        $result[$cont]['id'] = $plan['idelemento'];
                        $result[$cont]['text'] = $plan['denelemento'];
                        $result[$cont]['checked'] = false;
                        $result[$cont]['draggable'] = false;
                        $result[$cont]['iconCls'] = 'plan';
                        $result[$cont]['idelemento'] = $plan['idelemento'];
                        $result[$cont]['activo'] = $plan['activo'];
                        $result[$cont]['denelemento'] = $plan['denelemento'];
                        $result[$cont]['descelemento'] = $plan['descelemento'];
                        $result[$cont]['gradocumplimiento']
                            = $plan['gradocumplimiento'];
                        $result[$cont]['idtipoelemento']
                            = $plan['idtipoelemento'];
                        $result[$cont]['idusuariocrea']
                            = $plan['idusuariocrea'];
                        $result[$cont]['llevahistorial']
                            = $plan['llevahistorial'];
                        $result[$cont]['privado'] = $plan['privado'];
                        $result[$cont]['fechafin']
                            = $plan['DatPlanPdo']['fechafin'];
                        $result[$cont]['fechainicio']
                            = $plan['DatPlanPdo']['fechainicio'];
                        //buscar si tiene hijos
                        $elementHijos
                            = DatElementosDatElementos::BuscarElementosHijoMismoTipo(
                            $plan['idelemento']
                        );
                        $result[$cont]['leaf'] = ($elementHijos ? 0 : 1);
                        $cont++;
                    }
                }
                break;
            default:
                $idElemento = $idElemento;
                $listPlanes = DatElementos::GetPlanesDeUsuario(
                    $idUsuario, $idElemento
                );
                foreach ($listPlanes as $plan) {
                    $result[] = array();
                    $result[$cont]['id'] = $plan['idelemento'];
                    $result[$cont]['text'] = $plan['denelemento'];
                    $result[$cont]['checked'] = false;
                    $result[$cont]['draggable'] = false;
                    $result[$cont]['iconCls'] = 'plan';
                    $result[$cont]['idelemento'] = $plan['idelemento'];
                    $result[$cont]['activo'] = $plan['activo'];
                    $result[$cont]['denelemento'] = $plan['denelemento'];
                    $result[$cont]['descelemento'] = $plan['descelemento'];
                    $result[$cont]['gradocumplimiento']
                        = $plan['gradocumplimiento'];
                    $result[$cont]['idtipoelemento'] = $plan['idtipoelemento'];
                    $result[$cont]['idusuariocrea'] = $plan['idusuariocrea'];
                    $result[$cont]['llevahistorial'] = $plan['llevahistorial'];
                    $result[$cont]['privado'] = $plan['privado'];
                    $result[$cont]['fechafin']
                        = $plan['DatPlanPdo']['fechafin'];
                    $result[$cont]['fechainicio']
                        = $plan['DatPlanPdo']['fechainicio'];
                    //buscar si tiene hijos
                    $elementHijos
                        = DatElementosDatElementos::BuscarElementosHijoMismoTipo(
                        $plan['idelemento']
                    );
                    $result[$cont]['leaf'] = ($elementHijos ? 0 : 1);
                    $cont++;
                }
        }
        return $result;
    }

    public function adicionarRelaciones($parametros)
    {
        $arrayrelaciones = $parametros['arrayrelaciones'];
        $idObjetivo = $parametros['id_elemento'];
        $idUsuario = $parametros['id_usuario'];
        foreach ($arrayrelaciones as $relacion) {
            switch ($relacion->tipoelemento) {
                case 'ARC'://caso que la relacion es ARC
                    $respuesta = DatObjetivoModel::relacionarObjetivoARC(
                        $idObjetivo, $relacion, $idUsuario
                    );
                    break;
                case 'FIP'://caso que la relacion es FIP
                    $respuesta = DatObjetivoModel::relacionarObjetivoFip(
                        $idObjetivo, $idUsuario, $relacion
                    );
                    break;
                default:
            }
        }
        return $respuesta;
    }

    public function eliminarRelaciones($arrayrelaciones, $idObjetivo, &$msg)
    {
        foreach ($arrayrelaciones as $relacion) {
            switch ($relacion->tipoelemento) {
                case 'ARC'://caso que la relacion es ARC
                    DatObjetivo::EliminarRelacionObjARC(
                        $idObjetivo, $relacion->idelemento, $relacion->idplan
                    );
                    break;
                case 'FIP'://caso que la relacion es FIP
                    DatObjetivo::EliminarRelacionObjFip(
                        $idObjetivo, $relacion->idelemento
                    );
                    break;
                default:
            }
        }
        $msg = "La relaci&oacute;n se ha eliminado correctamente.";
    }

    function relacionarObjetivoFip($idObjetivo, $idUsuario, $fip)
    {
        $existe = 1;
        $rel = DatObjetivo::ObjetivoEstaRelacionadoConFip(
            $idObjetivo, $fip->idelemento
        );
        if (!isset($rel[0])) {//si no tienen relacion objetivo y fip
            // se prepara y adiciona la relacion obj-fip
            $dede = new DatElementosDatElementos();
            $dede->idelementopadre = $fip->idelemento;
            $dede->idelementohijo = $idObjetivo;
            $dede->idautor = $idUsuario;
            $dede->origen = (($idUsuario == $fip->idusuariocrea) ? 1 : 3);
            DatElementosDatElementosModel::Insertar($dede);
            return $existe;
        } else {
            $existe = 3;
            return $existe;
        }
    }

    function relacionarObjetivoARC($idObjetivo, $arc, $idUsuario)
    {
        //verificar si arc esta relacionado con algun plan dado
        $existe = 1;
        $planes = $arc->arrayPlanes;
        foreach ($planes as $plan) {
            //verificar si tienen relacion arc plan obj
            $relArcPlanObj = DatObjetivo::ObjetivoEstaRelacionadoConARCPlan(
                $idObjetivo, $plan->idelemento, $arc->idelemento
            );
            if (!isset($relArcPlanObj[0])) {//si no tienen relacion arc plan obj
                //verificar si tienen relacion arc plan
                $relArcPlan = DatObjetivo::ArcEstaRelacionadoConPlan(
                    $arc->idelemento, $plan->idelemento
                );
                if (!$relArcPlan) {//si no tienen relacion arc plan
                    //crear la relacion arc plan
                    $dadp = new DatArcDatPlan();
                    $dadp->idplan = $plan->idelemento;
                    $dadp->idarc = $arc->idelemento;
                    //$dadp->idactividad  =null;
                    DatArcDatPlanModel::Insertar($dadp);
                }
                //crear la relacion arc plan obj
                $dadpo = new DatArcDatPlanObjetivo();
                $dadpo->idobjetivo = $idObjetivo;
                $dadpo->idplan = $plan->idelemento;
                $dadpo->idarc = $arc->idelemento;
                $dadpo->idautor = $idUsuario;
                DatArcDatPlanObjetivoModel::Insertar($dadpo);
            } else {
                $existe = 3;
            }
            return $existe;
        }
    }

    function InvolucrarCriterio($involucrado, $idcriterio)
    {
        //contruir el id de involucrado
        if ($involucrado->tipoinvolucrado == 1) {
            $idinvolucrado = $involucrado->idinvolucrado;
            //$involucrado->idusuario.$involucrado->nivelinvolucrado;
        } else {
            $idinvolucrado = $involucrado->idinvolucrado;
        }//$involucrado->idgrupo.$involucrado->nivelinvolucrado;
        //buscar si esta la relacion criterio invol
        $relacion = DatCriterioDatInvolucrados::Buscar(
            $idcriterio, $idinvolucrado
        );
        if (!$relacion) {//si no esta la relacion
            //crear la relacion
            $nuevarelacion = new DatCriterioDatInvolucrados();
            $nuevarelacion->idcriteriomedida = $idcriterio;
            $nuevarelacion->idinvolucrado = $idinvolucrado;
            $nuevarelacion->save();
        }
    }

    function CargarArbolInvolucradosCriterio($parametros)
    {
        // obtengo todas las relaciones del objetivo y sus involucrados 
        // de la tabla DatElementosDatInvolucrados
        $arrayInvolucrados = DatObjetivoModel::RelacionesInvolucradoObjetivo(
            $parametros['id_objetivo']
        );
        if (isset($arrayInvolucrados)) { // si tiene involucrados
            $cont = 0;    // contador
            $listaInvolucrados = array();    // arreglo para llenar y devolver
            if ($parametros['idgrupo'] == 'nodo1') {// si es la carga inicial
                foreach ($arrayInvolucrados as $involucrado) {
                    $tieneHijos = 0;
                    $involDelCriterio = array();
                    // obtengo los datos de cada involucrado sin el nombre
                    $datosInvolucrado = Doctrine::getTable('DatInvolucrados')
                        ->find($involucrado['idinvolucrado']);
                    // datos del involucrado
                    $listaInvolucrados[$cont]['id']
                        = $datosInvolucrado->idinvolucrado;
                    $listaInvolucrados[$cont]['idinvolucrado']
                        = $datosInvolucrado->idinvolucrado;
                    $listaInvolucrados[$cont]['idgrupo']
                        = $datosInvolucrado->idgrupo;
                    $listaInvolucrados[$cont]['idnivelinvolucrado']
                        = $datosInvolucrado->idnivelinvolucrado; // responsable o ejecutor
                    $listaInvolucrados[$cont]['idusuario']
                        = $datosInvolucrado->idusuario;
                    $listaInvolucrados[$cont]['tipoinvolucrado']
                        = $datosInvolucrado->tipoinvolucrado; // grupo o usuario
                    $listaInvolucrados[$cont]['draggable'] = false;
                    // verifico si es un grupo
                    if ($datosInvolucrado->idgrupo) {
                        // capturo los datos del grupo
                        $datosGrupo
                            = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                            $datosInvolucrado->idgrupo
                        );
                        if (isset($datosGrupo)) {
                            $listaInvolucrados[$cont]['text']
                                = $datosGrupo->dengrupo;
                            $listaInvolucrados[$cont]['idgrupo']
                                = $datosGrupo->idgrupo;
                            $listaInvolucrados[$cont]['descgrupo']
                                = $datosGrupo->descgrupo;
                            $listaInvolucrados[$cont]['fechacreacion']
                                = $datosGrupo->fechacreacion;
                            $listaInvolucrados[$cont]['idusuariocrea']
                                = $datosGrupo->idusuariocrea;
                            $listaInvolucrados[$cont]['activo']
                                = $datosGrupo->activo;
                            $listaInvolucrados[$cont]['iconCls']
                                = 'grupoejecutor';
                        }
                        $tieneHijos
                            = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                            $datosInvolucrado->idgrupo
                        );
                        $listaInvolucrados[$cont]['leaf'] = (($tieneHijos) ? 0
                            : 1);
                    } else {// si es usuario
                        $listaInvolucrados[$cont]['leaf'] = 1;
                        $listaInvolucrados[$cont]['text'] = '';
                        $listaInvolucrados[$cont]['draggable'] = false;
                        $listaInvolucrados[$cont]['iconCls']
                            = 'usuarioejecutor';
                    }
                    if ($parametros['esta_modificando'] == 0) {
                        // si estoy adicionando criterio
                        $listaInvolucrados[$cont]['checked'] = false;
                    } else { // si estoy modificando
                        // pido las relaciones de criterio-involucrado
                        $involDelCriterio
                            = DatCriterioDatInvolucrados::Buscar(
                            $parametros['id_criterio'],
                            $involucrado['idinvolucrado']
                        );
                        if (isset($involDelCriterio[0])) {
                            // si tiene involucrados
                            $listaInvolucrados[$cont]['checked'] = true;
                            // los envio chequeados
                        } else {// si no tiene involucrados
                            $listaInvolucrados[$cont]['checked'] = false;
                        }    // los envio sin chequear
                    }
                    $cont++;
                }
            } else { // si despliego un grupo
                $involucradosGrupos
                    = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                    $parametros['idgrupo']
                );
                foreach ($involucradosGrupos as $invGrupo) {
                    $listaInvolucrados[$cont]['id']
                        = $invGrupo['idgrupo'] . $invGrupo['idusuario'];
                    $listaInvolucrados[$cont]['text'] = $invGrupo['alias'];
                    $listaInvolucrados[$cont]['idgrupo']
                        = $invGrupo['idgrupo'];
                    $listaInvolucrados[$cont]['idusuario']
                        = $invGrupo['idusuario'];
                    $listaInvolucrados[$cont]['leaf'] = 1;
                    $datosInvolGrupo
                        = DatInvolucrados::DameTodosDatosInvolucradosDadoIdUsuario(
                        $invGrupo['idusuario']
                    );
                    if (isset($datosInvolGrupo)) {
                        foreach ($datosInvolGrupo as $datosInv) {
                            $listaInvolucrados[$cont]['idinvolucrado']
                                = $datosInv->idinvolucrado;
                        }
                        $listaInvolucrados[$cont]['idnivelinvolucrado']
                            = $datosInv->idnivelinvolucrado;
                        $listaInvolucrados[$cont]['tipoinvolucrado']
                            = $datosInv->tipoinvolucrado;
                        $listaInvolucrados[$cont]['iconCls']
                            = 'usuarioejecutor';
                        $listaInvolucrados[$cont]['draggable'] = false;
                    }
                    $cont++;
                }
            }
        }
        return $listaInvolucrados;
    }

    function VerificarExistencia($idElemento)
    {
        //obtengo el objetivo
        $objetoObjetivo = DatObjetivo::Buscar($idElemento);
        //envio a la controladora
        return $objetoObjetivo;
    }


    public function obtenerEstadosAprobacion(
        $idsubsistema, $idusuariosession, $idtipodocumento, $idelemento,
        $idestadoinicial
    ) {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if ($idestadoinicial == $objelemento->idestadoaprob) {
            $objelementosmodel = new DatElementosModel();
            $estados = $objelementosmodel->ObtenerEstadosAModificarDoc(
                $idsubsistema, $idusuariosession, $idtipodocumento,
                $idestadoinicial
            );
        } else {
            $estados = array('codigo'  => 3,
                             'mensaje' => 'El estado de este objetivo ha sido 
                                 cambiado y no es el mismo que se le muestra en
                                 el registro. Por favor actualice el registro 
                                 de objetivos.');
        }
        return $estados;
    }


    public function CambiarEstadoAprob(
        $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj, $idsubsistema
    ) {
        $objelementosmodel = new DatElementosModel();
        $respuesta = $objelementosmodel->CambiarEstadoAprobacion(
            $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
            $idtipodoc, $obj, $idsubsistema
        );
        return $respuesta;
    }

    public function Adicionar(DatObjetivo $datObjetivo)
    {
        $datObjetivo->save();
    }

    public function DesglozarObjetivo(
        $idelemento, $idtipoelemento, $idobjetivogeneral
    ) {
        $arrayresp = array();
        $objetivogeneral = Doctrine::getTable('DatElementos')->find(
            $idobjetivogeneral
        );
        if (isset($objetivogeneral)) {
            switch ($idtipoelemento) {
                case 1:
                    $cont = 0;
                    $objelementomodel = new DatElementosModel();
                    $arregloelementos
                        = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                        $objetivogeneral, $arregloelementos, $idtipoelemento,
                        $objetivogeneral
                    );
                    if (isset($arregloelementos['criterios'])) {
                        foreach ($arregloelementos['criterios'] as $criterio) {
                            $objcriterio = Doctrine::getTable(
                                'DatCriteriomedida'
                            )->find($criterio['idcriteriomedida']);
                            if (isset($objcriterio)) {
                                $arrayresp[$cont]['id'] = $idelemento
                                    . $objcriterio->idcriteriomedida;
                                $arrayresp[$cont]['text']
                                    = $objcriterio->dencriterio;
                                $arrayresp[$cont]['idelemento']
                                    = $objcriterio->idcriteriomedida;
                                $fechainicio = $objcriterio->fechainicio;
                                if ($fechainicio == null) {
                                    $fechainicio = 'No tiene';
                                }
                                $fechafin = $objcriterio->fechafin;
                                if ($fechafin == null) {
                                    $fechafin = 'No tiene';
                                }
                                $arrayresp[$cont]['fechainicio'] = $fechainicio;
                                $arrayresp[$cont]['fechafin'] = $fechafin;
                                $arrayresp[$cont]['usuario'] = '';
                                $arrayresp[$cont]['iconCls'] = 'criterio';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 5;
                                $arrayresp[$cont]['tipoelemento']
                                    = 'Criterio de medida';
                                $arrayresp[$cont]['umedida']
                                    = $this->ObtenerDenominacionNomencladorElemento(
                                    $objcriterio->idcriteriomedida,
                                    $tiponom = 1, 'C'
                                );
                                $arrayresp[$cont]['valormeta']
                                    = $objcriterio->valormeta;
                                $arrayresp[$cont]['valoreal']
                                    = $objcriterio->valoreal;
                                $arrayresp[$cont]['estadocump']
                                    = $objcriterio->estadocumplimiento;
                                $arrayresp[$cont]['porciento']
                                    = $objcriterio->gradocumplimiento . '%';
                                $arrayresp[$cont]['leaf'] = true;
                                $cont++;
                            }
                        }
                    }
                    if (isset($arregloelementos['actividades'][0])) {
                        foreach ($arregloelementos['actividades'] as $actividad)
                        {
                            $objelementoact = Doctrine::getTable('DatElementos')
                                ->find($actividad['idelemento']);
                            $objact = Doctrine::getTable('DatActividades')
                                ->find($actividad['idelemento']);
                            if (isset($objelementoact)) {
                                $arrayresp[$cont]['id']
                                    = $idelemento . $objelementoact->idelemento;
                                $arrayresp[$cont]['text']
                                    = $objelementoact->denelemento;
                                $arrayresp[$cont]['idelemento']
                                    = $objelementoact->idelemento;
                                $fechainicio = $objact->fechainicio;
                                if ($fechainicio == null) {
                                    $fechainicio = 'No tiene';
                                }
                                $fechafin = $objact->fechafin;
                                if ($fechafin == null) {
                                    $fechafin = 'No tiene';
                                }
                                $arrayresp[$cont]['fechainicio'] = $fechainicio;
                                $arrayresp[$cont]['fechafin'] = $fechafin;
                                $arrayresp[$cont]['usuario']
                                    = $this->integrator->seguridad->nombreUsuario(
                                    $objelementoact->idusuariocrea
                                );
                                $arrayresp[$cont]['iconCls'] = 'actividad';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arrayresp[$cont]['tipoelemento'] = 'Actividad';
                                $arrayresp[$cont]['estadocump']
                                    = $objelementoact->estadocumplimiento;
                                $arrayresp[$cont]['categoria']
                                    = $this->ObtenerDenominacionNomencladorElemento(
                                    $objelementoact->idelemento, $tiponom = 2,
                                    'E'
                                );
                                $arrayresp[$cont]['tipoact']
                                    = $this->ObtenerDenominacionNomencladorElemento(
                                    $objelementoact->idelemento, $tiponom = 3,
                                    'E'
                                );
                                $arrayresp[$cont]['lugar'] = $objact->lugar;
                                $arrayresp[$cont]['horainicio']
                                    = $objact->horainicio;
                                $arrayresp[$cont]['horafin'] = $objact->horafin;
                                $arrayresp[$cont]['porciento']
                                    = $objelementoact->gradocumplimiento . '%';
                                $arrayresp[$cont]['leaf'] = true;
                                $cont++;
                            }
                        }
                    }
                    break;
            }
        }
        return $arrayresp;
    }


    public function ObtenerDenominacionNomencladorElemento(
        $idelemento, $tiponom, $base
    ) {
        $dennomenclador = '';
        if ($base == 'E') {
            $nomenclador
                = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                $idelemento, $tiponom
            );
            $idnomenclador = $nomenclador[0]['idnomenclador'];
        } else {
            $idnomenclador = Doctrine::getTable('DatCriteriomedida')->find(
                $idelemento
            )->idumedida;
            $nomenclador = 1;
        }
        if ($nomenclador) {
            $datosnomenclador
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $idnomenclador
            );
            $dennomenclador = $datosnomenclador->dennomenclador;
        }
        return $dennomenclador;
    }


}
