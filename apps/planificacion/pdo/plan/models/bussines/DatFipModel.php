<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatFipModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatFip $datFip)
    {
        $datFip->save();
    }

    public function Actualizar(DatFip $datFip)
    {
        $datFip->save();
    }

    public function Eliminar($datFip)
    {
        $datFip->delete();
    }

    //elimianar fip recursivo
    function EliminarFip($idfip)
    {
        $cont = 0;
        $sepuedeeliminar
            = 1; //inicalmente estara en 0, hasta ke el workflow  trabaje
        $arrayrelacionesconact = DatElementosDatElementos::BuscarElementos(
            $idfip
        );
        if ($arrayrelacionesconact) {
            foreach ($arrayrelacionesconact as $relacion) {
                $idelementopadre = $relacion ['idelementopadre'];
                $idelementohijo = $relacion ['idelementohijo'];
                $origen = $relacion ['origen'];
                if ($idelementopadre == $idfip
                    && ($origen == 0
                        || $origen == 2)
                ) {
                    $arrayidacthijas [$cont] ['idelemento'] = $idelementohijo;
                    $cont++;
                }
                $objrelacion = Doctrine::getTable('DatElementosDatElementos')
                    ->findByDql(
                        "idelementopadre = $idelementopadre 
                            AND idelementohijo = $idelementohijo"
                    );
                $objrelacion->delete();
            }
            if ($sepuedeeliminar == 1) {
                $objact = Doctrine::getTable('DatElementos')->find($idfip);
                if ($objact->idelemento) {
                    $objact->delete();
                }
            }
            if ($arrayidacthijas) {
                foreach ($arrayidacthijas as $acthija) {
                    $this->EliminarFip($acthija ['idelemento']);
                }
            }
        }
        if (!$arrayrelacionesconact) {
            if ($sepuedeeliminar == 1) {
                $objact = Doctrine::getTable('DatElementos')->find($idfip);
                if ($objact->idelemento) {
                    $objact->delete();
                }
            }
        }
    }

    function VerificarExistencia($idElemento)
    {
        //obtengo el FIP
        $objetoFip = DatFip::Buscar($idElemento);
        //envio a la controladora
        return $objetoFip;
    }



    public function ObtenerFIP(
        $idusuariosession, $denominacion, $fechainicio, $fechafin,
        $arrayautores, $arrayinvolucrados,
        $offset, $limit
    ) {
        $arrayfipss = DatFip::ObtenerFIP(
            $denominacion, $fechainicio, $fechafin, $arrayautores,
            $arrayinvolucrados,
            $offset, $limit
        );
        $arrayfips = $arrayfipss[1];
        if (isset($arrayfips[0]['idelemento'])) {
            foreach ($arrayfips as $key => $fip) {
                $leaf = true;
                $tienefiphijas = DatElementosDatElementos::EsElementoP(
                    $fip['idelemento']
                );
                if (isset($tienefiphijas[0])) {
                    foreach ($tienefiphijas as $hija) {
                        $idelementohijo = $hija['idelementohijo'];
                        foreach ($arrayfips as $fp) {
                            if ($fp['idelemento'] == $idelementohijo) {
                                $leaf = false;
                            }
                        }
                    }
                }
                $parent = null;
                $tienefiptpadre = DatElementosDatElementos::EsElementoHijo(
                    $fip['idelemento']
                );
                if (isset($tienefiptpadre[0])) {
                    foreach ($tienefiptpadre as $padre) {
                        $idpadre = $padre['idelementopadre'];
                        foreach ($arrayfips as $fp) {
                            if ($fp['idelemento'] == $idpadre) {
                                $parent = $idpadre;
                            }
                        }
                    }
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                //$entrada = 1;
                if ($fip['idautor'] != $idusuariosession) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $fip['idautor'], $certificado,
                        $iddominio
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                $arrayfips[$key]['autor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $fip['idautor']
                );
                $arrayfips[$key]['user'] = $fip['idautor'];
                $arrayfips[$key]['estado']
                    = $fip['estadocumplimiento'] . "("
                    . $fip['gradocumplimiento']
                    . "%)";
                $arrayfips[$key]['_is_leaf'] = $leaf;
                $arrayfips[$key]['_parent'] = $parent;
                $arrayfips[$key]['superior'] = $superior;
                $arrayfips[$key]['subordinado'] = $subordinado;
                $arrayfips[$key]['modificar'] = $modificar;
                $arrayfips[$key]['eliminar'] = $eliminar;
                $arrayfips[$key]['fechacumplimiento'] = $fip['fechafin'];
            }
            $arrayfipss[1] = $arrayfips;
        }
        return $arrayfipss;
    }


    public function DesglozarFIP($idelemento, $idtipoelemento)
    {
        $arrayresp = array();
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if (isset($objelemento)) {
            switch ($idtipoelemento) {
                case 2:
                    $cont = 0;
                    $objelementomodel = new DatElementosModel();
                    $arregloelementos
                        = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                        $objelemento, $arregloelementos, $idtipoelemento,
                        $objelemento
                    );
                    if (isset($arregloelementos['fip_activ'][0])) {
                        foreach ($arregloelementos['fip_activ'] as $fip) {
                            $objelementoact = Doctrine::getTable('DatElementos')
                                ->find($fip['idelemento']);
                            $objact = Doctrine::getTable('DatActividades')
                                ->find($fip['idelemento']);
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
                                    $base = 'E'
                                );
                                $arrayresp[$cont]['tipoact']
                                    = $this->ObtenerDenominacionNomencladorElemento(
                                    $objelementoact->idelemento, $tiponom = 3,
                                    $base = 'E'
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

