<?php 
class DatReciengraduadoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRecienGraduado($filtro, $idestructura, $idcargo, $limit = null, $start = 0)
    {
        try {
            $obj = new DatReciengraduado();
            $idscargos = Array();
            if (empty($idcargo)) {
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
                if (count($cargos) > 0) {
                    foreach ($cargos as $carg) {
                        array_push($idscargos, $carg['idcargo']);
                    }
                }
            } else {
                array_push($idscargos, $idcargo);
            }
            $datos = $obj->getRecienGraduado($filtro, $idscargos, $start, $limit);

            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $objrg) {
                    $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                        array($objrg['idjefeinmediato'], $objrg['idtutor'])
                    );
                    $posper = ($personas->data[0]['idpersona'] == $objrg['idjefeinmediato'])? 0 : 1;
                    $pospert = ($personas->data[0]['idpersona'] == $objrg['idtutor']) ? 0 : 1;
                    $datos[$p]['jefeinmediato'] = $personas->data[$posper]['nombreapellidos'];
                    $datos[$p]['tutor'] = $personas->data[$pospert]['nombreapellidos'];
                    $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($objrg['idarea']);
                    $datos[$p]['area'] = $area[0]->denominacion;
                    //Calculando la fecha fin de la preparaci�n
                    $fecha = explode('/', $objrg['fdesde']);
                    $meses = $fecha[1] + $objrg['tiempo'];
                    $resto = $meses % 12;
                    $result = floor($meses/12);
                    $fecha[2] = $fecha[2] + $result;
                    $fecha[1] = $resto;
                    $datos[$p]['ffinprep'] = implode('/', $fecha);
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantRecienGraduado($filtro, $idscargos);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getRecienGraduadoById($idreciengraduado)
    {
        try {
            $obj = new DatReciengraduado();
            $datos = $obj->getRecienGraduadoById($idreciengraduado);
            if (count($datos) == 0) {
                $datos = Array();
            } else {
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datos[0]['idarea']);
                $datos[0]['area'] = $area[0]->denominacion;
                $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                        array($datos[0]['idpersona'], $datos[0]['idjefeinmediato'], $datos[0]['idtutor'])
                );

                foreach ($personas->data as $p => $objrg) {
                    if ($objrg['idpersona'] == $datos[0]['idpersona']) {
                        $datos[0]['reciengraduado'] = $objrg['nombreapellidos'];
                        $datos[0]['cargo'] = $objrg['denomcargo'];
                    } else if ($objrg['idpersona'] == $datos[0]['idjefeinmediato']) {
                        $datos[0]['jefeinmediato'] = $objrg['nombreapellidos'];
                    } else {
                        $datos[0]['tutor'] = $objrg['nombreapellidos'];
                    }
                }
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addRecienGraduado($idpersona, $idjefeinmediato, $idtutor, $tiempo, $fdesde, $fhastass, $idperiodo)
    {
        try {
            $existe = DatReciengraduado::existe($idpersona);
            if (count($existe) == 0) {
                $obj = new DatReciengraduado();
                $obj->idpersona = $idpersona;
                $obj->idjefeinmediato = $idjefeinmediato;
                $obj->idtutor = $idtutor;
                $obj->tiempo = $tiempo;
                $obj->fdesde = $fdesde;
                $obj->fhastass = $fhastass;
                $obj->idperiodo = $idperiodo;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 2;
        }
    }

    public function updateRecienGraduado(
        $idreciengraduado, $idpersona, $idjefeinmediato, $idtutor, $tiempo, $fdesde, $fhastass, $idperiodo
    )
    {
        try {
            $obj = DatReciengraduado::getById($idreciengraduado);
            $existe = DatReciengraduado::existe($idpersona);
            if (count($existe) == 0 || $existe[0]['idreciengraduado'] == $idreciengraduado) {
                $obj->idpersona = $idpersona;
                $obj->idjefeinmediato = $idjefeinmediato;
                $obj->idtutor = $idtutor;
                $obj->tiempo = $tiempo;
                $obj->fdesde = $fdesde;
                $obj->fhastass = $fhastass;
                $obj->idperiodo = $idperiodo;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 2;
        }
    }

    public function deleteRecienGraduado($idreciengraduado)
    {
        try {
            $obj = DatReciengraduado::getById($idreciengraduado);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}