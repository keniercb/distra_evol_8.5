<?php
/**
 * @author    Jesus Ariel Guerra Lopez
 * @version   3.0.0
 * @copyright XETID, ERP-CUBA
 */
/*
Esta clase sirve de intermediaria para realizar dependencias entre elementos
*/

class DependenciaModel extends ZendExt_Model
{

    public function setUp()
    {
        $this->objElemElem = new DatElementosDatElementos();
        parent::ZendExt_Model();
    }


    function GenerarDependencia($parametros)
    {
        $errores = 1;
        if (isset($parametros->arraydependencias[0])) {
            $elHijo = Doctrine::getTable('DatActividades')->find(
                $parametros->idelementohijo
            );
            if ($parametros->idmodulo == 2) {
                $elHijo = DatActividades::getTarea(
                    $parametros->idelementohijo
                )[0];
            }
            $model = new CmpgestionaractividadesModel();
            $arreglo = array();
            foreach ($parametros->arraydependencias as $idactpadre) {
                $parametros->idactpadre = $idactpadre;
                $elPadre = Doctrine::getTable('DatActividades')->find(
                    $idactpadre
                );
                if ($parametros->idmodulo == 2) {
                    $elPadre = DatActividades::getTarea($idactpadre)[0];
                }
                if (isset($elPadre) && isset($elHijo)) {
                    $model->BuscarInferiores($elHijo->idactividad, $arreglo);
                    if (isset($arreglo[0])) {
                        foreach ($arreglo as $value) {
                            if ($value == $elPadre->idactividad) {
                                $errores++;
                            }
                        }
                    }
                    $dias = $model->dias_transcurridos(
                        $elPadre->fechafin, $elHijo->fechainicio
                    );
                    $diasP = $model->dias_transcurridos(
                        $elPadre->fechainicio, $elHijo->fechainicio
                    );
                    if ($parametros->origen == 6) {
                        if ($dias <= 0 && $errores == 1) {
                            DatElementosDatElementos::InsertarDependencia(
                                $parametros
                            );
                        } else {
                            $errores++;
                        }
                    } else {
                        if ($diasP <= 0 && $errores == 1) {
                            DatElementosDatElementos::InsertarDependencia(
                                $parametros
                            );
                        } else {
                            $errores++;
                        }
                    }
                }
            }
            return $errores;
        }
        return 3;
    }


}

