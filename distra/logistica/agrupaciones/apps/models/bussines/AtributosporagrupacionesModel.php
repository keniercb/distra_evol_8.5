<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AtributosporagrupacionesModel
 *
 * @author gerardo
 */
class AtributosporagrupacionesModel extends ZendExt_Model
{
    private $nomAgrupacion;
    private $atribest;

    public function AtributosporagrupacionesModel()
    {
        $this->_campo_model = new ZendExt_Metadata_Models_CampoModel();
        $this->nomAgrupacion = new NomAgrupacion();
        $this->_tabla_model = new ZendExt_Metadata_Models_TablaModel();
        $this->atribest = new DatAtributoestatico;
        parent::ZendExt_Model();
    }

    public function adicionarAgrupaciones($parametros)
    {
        $existe = Doctrine::getTable('NomAgrupacion')->findByDql('denominacion = ?', array($parametros['denominacion']));
        if (count($existe->toArray()) != 0) {
            return 2;
        }
        if ($parametros['nodo']) {
            $NomAgrupacion = Doctrine::getTable('NomAgrupacion')->find($parametros['nodo']);
        } else {
            $NomAgrupacion = new NomAgrupacion();
        }
        $NomAgrupacion->synchronizeWithArray($parametros);
        $NomAgrupacion->save();
    }

    public function eliminarAgrupacion($parametros)
    {
        $nomAgrup = Doctrine::getTable('NomAgrupacion')->find($parametros['idagrupacion']);
        $nomAgrup->delete();
    }

    public function obtenerAtributosAgrupacion($parametros)
    {
        $parametros['idagrupacion'] = $parametros['node'];
        $arreglodatos = $this->atribest->getAtributosDadoAgrupacion($parametros);
        $datos = $arreglodatos['datos'];
        if ($parametros['idindicador']) {
            $datos = $this->atribest->comprobarRelacionIndicador($datos, $parametros['idindicador']);
        }
        return $datos;
    }

    public function cargaragrupaciones($parametros)
    {
        if ($parametros['node'] == 0) {
            $datos = $this->nomAgrupacion->cargaragrupaciones($parametros);
            foreach ($datos as &$dat) {
                $hijosDat = self::obtenerAtributosAgrupacion(array('idindicador' => $parametros['idindicador'],
                        'node' => $dat['idagrupacion']));
                $tieneHijosChequeados = false;
                $tieneTodosHijosChequeados = true;
                foreach ($hijosDat as $hijodat) {
                    if ($hijodat['marcado'] == 1) {
                        $tieneHijosChequeados = true;
                    } else {
                        $tieneTodosHijosChequeados = false;
                    }
                }
                $dat['denominacion'] = ($tieneHijosChequeados) ? '<span style="font-weight: bold;">'.
                    $dat['denominacion'].'</span>' : $dat['denominacion'];

                $dat['tieneTodosHijosChequeados'] = $tieneTodosHijosChequeados;
            }
        } else {
            $datos = self::obtenerAtributosAgrupacion($parametros);
        }
        foreach ($datos as $key => $value) {

            $datos[$key]["_parent"] = ($parametros['node']) ? $parametros['node'] : null;
            $datos[$key]["leaf"] = ($parametros['node']) ? true : false;
            $datos[$key]["_is_leaf"] = ($parametros['node']) ? true : false;
            $datos[$key]["_is_loaded"] = false;
            $datos[$key]["id"] = ($parametros['node']) ? null : $value['idagrupacion'];
            $datos[$key]["text"] = $value['denominacion'];
            $datos[$key]['agrup'] = ($parametros['node']) ? 0 : 1;
            if ($parametros['concheck'] && $parametros['concheck'] != -1) {
                if (!$datos[$key]["_is_leaf"]) {
                    $datos[$key]["text"] = $value['denominacion'];
                } else {
                    $datos[$key]["text"] = ($value['nivelnomenclador'] == 1) ? '<span style="color:#49b722;">'.$value['denominacion'].'</span>' :
                        '<span style="color:#e80628;">'.$value['denominacion'].'</span>';
                }

                if ($parametros['marcaHijos'] == 2) {
                    $datos[$key]["checked"] = true;
                } elseif ($datos[$key]['marcado'] == 1) {
                    $datos[$key]["checked"] = true;
                } elseif ($datos[$key]['tieneTodosHijosChequeados']) {
                    $datos[$key]["checked"] = true;
                } else {
                    $datos[$key]["checked"] = false;
                }
            }
        }
        return $datos;
    }

    public function GetTiposDatos()
    {
        return $this->_campo_model->cargarTiposDatos();
    }

    public function GetTablasNomencladores()
    {
        return $this->_tabla_model->cargarNomencladores();
    }

    public function GetExpresionesRegulares()
    {
        return $this->_campo_model->cargarExpresionesRegulares();
    }

    public function adicionarAtributo($parametros)
    {
        if ($parametros['idatributo']) {
            $cantAtri = Doctrine::getTable('DatConfAtributoIndicador')->findByDql('idatributo = ?',
                array($parametros['idatributo']));
            if (count($cantAtri->toArray()) != 0) {
                return 2;
            } else {
                $atrib = Doctrine::getTable('DatAtributoestatico')->find($parametros['idatributo']);
            }
        } else {
            $atrib = new DatAtributoestatico();
        }
        $parametros['permitenulo'] = ($parametros['permitenulo'] == -1) ? 0 : 1;
        $parametros['nivelnomenclador'] = ($parametros['nivelnomenclador']) ? $parametros['nivelnomenclador'] : 0;
        $atrib->synchronizeWithArray($parametros);
        $atrib->save();
    }

    public function eliminarAtributo($parametros)
    {
        $collection = new Doctrine_Collection('DatAtributoestatico');
        foreach ($parametros->atributos as $key => $value) {
            $cantAtri = Doctrine::getTable('DatConfAtributoIndicador')->findByDql('idatributo = ?', array($value));
            if (count($cantAtri->toArray()) != 0) {
                return 2;
            } else {
                $atri = Doctrine::getTable('DatAtributoestatico')->find($value);
            }
            $collection->add($atri);
        }
        $collection->delete();
    }

    public function cargarAtributos($parametros)
    {
        $result = $this->atribest->getAtributosDadoAgrupacion($parametros);
        return $result;
    }

}
