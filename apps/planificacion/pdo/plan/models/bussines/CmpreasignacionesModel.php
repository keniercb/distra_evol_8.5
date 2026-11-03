<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpreasignacionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function CargarReasignaciones(
        $tipoelemento, $idelemento, $idusuariosession, $limit, $start
    ) {
        $cont = 0;
        switch ($tipoelemento) {
            case 3:
                $arrayreasignaciones
                    = DatElementosDatElementos::CargarGridReasignacionesALL(
                    $idelemento
                );
                if (isset($arrayreasignaciones[0])) {
                    foreach ($arrayreasignaciones as $key => $reasignacion) {
                        $arrayreasignaciones[$key]['numero'] = $key + 1;
                        $arrayreasignaciones[$key]['fechareasignacion']
                            = $reasignacion['DatElementos']['fechacreacion'];
                        $textonombre = '';
                        $arrayinvolucrados
                            = $reasignacion['DatElementos']['DatElementosDatInvolucrados'];
                        if (isset($arrayinvolucrados[0])) {
                            foreach (
                                $arrayinvolucrados as /* $pos =>*/
                                $involucrado
                            ) {
                                if ($involucrado['DatInvolucrados']['tipoinvolucrado']
                                    == 0
                                ) {
                                    $grupo
                                        = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                                        $involucrado['DatInvolucrados']['idgrupo']
                                    );
                                    $textonombre .= (strlen($textonombre)==0)? $grupo->dengrupo:
                                                                         ', '. $grupo->dengrupo;
                                } else {
                                   $struser=''.$this->integrator->seguridad->nombreUsuario(
                                       $involucrado['DatInvolucrados']['idusuario']
                                     );
                                    $textonombre .= (strlen($textonombre)==0)?
                                      $struser:', '.$struser;
                                }
                            }
                        }
                        $arrayreasignaciones[$key]['textoinvolucrados']
                            = $textonombre;
                        $superior = 0;
                        $eliminar = 1;
                        if ($reasignacion['idautor'] != $idusuariosession) {
                            $superior = 1;
                            $eliminar = 0;
                        }
                        $arrayreasignaciones[$key]['superior'] = $superior;
                        $arrayreasignaciones[$key]['eliminar'] = $eliminar;
                        $cont++;
                    }
                }
                $data['contador'] = $cont;
                $data['array'] = $arrayreasignaciones;
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
                        $arrayrelac[$cont]['idrelacion']
                            = $idelemento . $objelemento->idelemento;
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
                $data['contador'] = $cont;
                $data['array'] = $arrayrelac;
                return $data;
                break;
        }
    }

    public function EliminarReasignaciones($parametros)
    {
        $objelementopadre = Doctrine::getTable('DatElementos')->find(
            $parametros->idelementopadre
        );
        if (isset($objelementopadre->idelemento)) {
            $cantelementoselim = 0;
            if (isset($parametros->arrayidelementos)) {
                foreach ($parametros->arrayidelementos as $idelemento) {
                    $objelemento = Doctrine::getTable('DatElementos')->find(
                        $idelemento
                    );
                    if (isset($objelemento->idelemento)) {
                        $objelemento->delete();
                        $cantelementoselim++;
                    }
                }
            }
            if ($cantelementoselim == 0) {
                $respuesta = 0;
            } else {
                $respuesta = 1;
            }
        } else {
            $respuesta = 3;
        }
        return $respuesta;
    }


}
