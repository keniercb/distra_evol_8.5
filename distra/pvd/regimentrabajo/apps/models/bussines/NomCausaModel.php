<?php

class NomCausaModel extends ZendExt_Model
{
    protected $NomCausa;

    function __construct()
    {
        $this->NomCausa = new NomCausa();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->NomCausa = new NomCausa();
    }

    public function Actualizar(NomCausa $Causa)
    {
        $Causa->save();
    }

    public function Eliminar($idcausa)
    {
        $obj = Doctrine:: getTable('NomCausa')->find($idcausa);
        try {
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function GetByLimit()
    {
        $causa = new NomCausa();
        return $causa->GetPorLimite();
    }

    public function GetByLimitAsist()
    {
        $causa = new NomCausa();
        return $causa->GetPorLimiteAsist();
    }

    public function GetByLimitAsistSesiones()
    {
        $causa = new NomCausa();
        return $causa->GetPorLimiteAsistSesiones();
    }

    public function GetByLimitAsistBySesiones()
    {
        $causa = new NomCausa();
        return $causa->GetPorLimiteAsistBySesiones();
    }

    public function GetCausasCat($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->GetCausasCat($idcategoria);
    }

    public function getcantCausasByCategoria($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->getcantCausasByCategoria($idcategoria);
    }

    public function getcantCausasByCategoriaSesiones($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->getcantCausasByCategoriaSesiones($idcategoria);
    }

    public function getcantCausasByCategoriaBySesiones($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->getcantCausasByCategoriaBySesiones($idcategoria);
    }

    public function GetCausasByCategoria($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->GetCausasByCategoria($idcategoria);
    }

    public function GetCausasByCategoriaSesiones($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->GetCausasByCategoriaSesiones($idcategoria);
    }

    public function GetCausasByCategoriaBySesiones($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->GetCausasByCategoriaBySesiones($idcategoria);
    }

    public function GetByLimithijos($id)
    {
        $causa = new NomCausa();
        return $causa->GetByLimithijos($id);
    }

    public function GetByLimithijosAsist($id)
    {
        $causa = new NomCausa();
        return $causa->GetByLimithijosAsist($id);
    }

    public function GetByLimithijosAsistSesiones($id)
    {
        $causa = new NomCausa();
        return $causa->GetByLimithijosAsistSesiones($id);
    }

    public function GetByLimithijosAsistBySesiones($id)
    {
        $causa = new NomCausa();
        return $causa->GetByLimithijosAsistBySesiones($id);
    }

    public function GethijosNoCategoria($id)
    {
        $causa = new NomCausa();
        return $causa->GethijosNoCategoria($id);
    }

    public function getDenomCausa()
    {
        $causa = new NomCausa();
        return $causa->getDenomCausa();
    }

    public function GetCausasById($idcausa)
    {
        $causa = new NomCausa();
        return $causa->GetCausasById($idcausa);
    }

    public function getHijos($idcausa)
    {
        $causa = new NomCausa();
        return $causa->getHijos($idcausa);
    }


    public function GetAll()
    {
        $causa = new NomCausa();
        return $causa->GetTodos();
    }

    public function GetByLimitFind($criterio)
    {
        $causa = new NomCausa();
        return $causa->GetByLimitFind($criterio);
    }

    public function GetAllFind($criterio)
    {
        $causa = new NomCausa();
        return $causa->GetAllFind($criterio);
    }

    public function GetCausaByCategoria($idcategoria)
    {
        $causa = new NomCausa();
        return $causa->GetCausaByCategoria($idcategoria);
    }

    public function Existe($atributo, $valor)
    {
        $causa = Doctrine::getTable('NomCausa')->findBy($atributo, $valor);
        return $causa->toArray();
    }

    public function guardarcausasreporteausencia($idvariablesconfreportescertificaciones, $arreglo)
    {
        $array = DatCausasreporteausencia:: existeCausasreporteausencia($idvariablesconfreportescertificaciones);
        if ($array == null) {
            foreach ($arreglo as $value) {
                $obj = new DatCausasreporteausencia();
                $obj->idvariablesconfreportescertificaciones = $idvariablesconfreportescertificaciones;
                $obj->idcausa = $value;
                $obj->save();
            }
        } else {
            $result[] = DatCausasreporteausencia:: eliminarCausasreporteausencia($idvariablesconfreportescertificaciones);
            foreach ($arreglo as $value) {
                $obj = new DatCausasreporteausencia();
                $obj->idvariablesconfreportescertificaciones = $idvariablesconfreportescertificaciones;
                $obj->idcausa = $value;
                $obj->save();
            }
        }
    }

    public function getCausasByIdreporteausencia($idvariablesconfreportescertificaciones)
    {
        return DatCausasreporteausencia::getCausasByIdreporteausencia($idvariablesconfreportescertificaciones);
    }

    public function GetCausas()
    {
        return NomCausa::GetCausas();
    }

    public function existeCausa($idcausa)
    {
        $obj = new DatCausasreporteausencia();
        return $obj->existeCausa($idcausa);
    }

    public function eliminarCausa($idcausa)
    {
        $obj = new DatCausasreporteausencia();
        return $obj->eliminarCausa($idcausa);
    }

    public function CausaDescuenta($idcausa)
    {
        $obj = new NomCausa();
        if ($obj->CausaDescuenta($idcausa) == null) {
            return false;
        }
        return true;
    }

    public function getCausasHijos()
    {
        $arreglo = null;
        $a = array();
        $result = array();
        $model = new NomCausaModel();
        $r = $model->GetCausas();
        $var = 0;
        foreach ($r as $key => $valor) {
            $arreglo = $model->GethijosNoCategoria($valor['idcausa']);
            if (count($arreglo) == 0) {
                $a[$var]['idcausa'] = $valor['idcausa'];
                $a[$var]['denominacion'] = $valor['denominacion'];
                $a[$var]['abreviatura'] = $valor['abreviatura'];
                $a[$var]['camino'] = $valor['camino'];
                $var++;
            }
        }
        return $a;
    }

    public function GetTreeCausas()
    {
        $domain = new NomCausa();
        $roots = $domain->GetRootsCategoria(false);
        if (count($roots) != 0) {
            foreach ($roots as $key => $root) {
                $roots[$key]['id'] = $root['idcausa'];
                $roots[$key]['text'] = $root['denominacion'];
                if (!empty($root['abreviatura']))
                    $roots[$key]['checked'] = true;
                $tempChilds = $this->GetChildrensRecursively($root['idcausa']);
                if (count($tempChilds) > 0) {
                    $roots[$key]['children'] = $tempChilds;
                    $roots[$key]['leaf'] = false;
                } else {
                    $roots[$key]['leaf'] = true;
                }
            }
        }
        return $roots;
    }

    public function GetChildrensRecursively($idcausa)
    {
        $Childs = $this->getHijos($idcausa);
        if (count($Childs) != 0) {
            foreach ($Childs as $key => $child) {
                $Childs[$key]['id'] = $child['idcausa'];
                $Childs[$key]['text'] = $child['denominacion'];
                if (!empty($child['abreviatura']))
                    $Childs[$key]['checked'] = true;
                $tempChilds = $this->GetChildrensRecursively($child['idcausa']);
                if (count($tempChilds) > 0) {
                    $Childs[$key]['children'] = $tempChilds;
                    $Childs[$key]['leaf'] = false;
                } else {
                    $Childs[$key]['leaf'] = true;
                }
            }
        }
        return $Childs;
    }

    public function GetCausasMultiEncabezado()
    {
        $domain = new NomCausa();
        $roots = $domain->GetRootsCategoria(true);       
        $leafs = $domain->GetLeafs();
        $data = array();
        if (count($roots) > 0) {
            foreach ($roots as $key => $root) {
                $data[$key]['dataindex'] = $root['idcausa'] . '/' . $root['idcategoria'];
                $data[$key]['denom'] = $root['denominacion'];
                $data[$key]['afectasalario'] = $root['afectasalario'];
                $data[$key]['denominacion'] = $root['denominacion'];
                $data[$key]['childrens'] = array();
                foreach ($leafs as $key1 => $leaf) {
                    if ($leaf['idcategoria'] == $root['idcategoria'] || !is_numeric($leaf['idcategoria'])) {
                        $temp['dataindex'] = $leaf['idcausa'] . '/' . $root['idcategoria'];
                        $temp['denom'] = $leaf['abreviatura'];
                        $temp['afectasalario'] = $leaf['afectasalario'];
                        $temp['denominacion'] = $leaf['denominacion'];
                        array_push($data[$key]['childrens'], $temp);
                    }
                }
            }
        } else {
            foreach ($leafs as $key1 => $leaf) {
                $data[$key1]['dataindex'] = $leaf['idcausa'];
                $data[$key1]['denom'] = $leaf['abreviatura'];
                $data[$key1]['afectasalario'] = $leaf['afectasalario'];
                $data[$key1]['denominacion'] = $leaf['denominacion'];
            }
        }
        $result[0] = $data;
        $result[1] = (count($roots) > 0) ? 1 : 0;
        return $result;
    }

    public function GetHojas()
    {
        $domain = new NomCausa();
        $leafs = $domain->GetLeafs();
        return $leafs;
    }


}

