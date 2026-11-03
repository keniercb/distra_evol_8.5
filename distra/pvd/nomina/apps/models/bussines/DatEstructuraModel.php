<?php

class DatEstructuraModel extends ZendExt_Model
{
    public $objEstructuraService;

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    function __construct()
    {
        $this->objEstructuraService = new EyCServicesNomina();

    }

    public function getRoot($id)
    {
        $estructura=$this->objEstructuraService->getEstructura($id);
        $array[0]->id =$id;
        $array[0]->text = $_SESSION['Zeolides']['entidad']->denominacion;
        $array[0]->leaf = true;
        $array[0]->checked = false;
        $array[0]->icon= $estructura[0]->icon;
        $array[0]->idconcepto = $estructura[0]->idconcepto;
        return $array;
    }

    public function getEstructura($id, $ext = false)
    {
        $arrEntidad = $this->objEstructuraService->getHijosEstructura($id);
        $array = array();
        foreach ($arrEntidad as $v) {
           if ($v->idconcepto !=10 && $v->idconcepto != 7) {
               $p = count($array);
               $array[$p] = $v;
            }
        }
        return $array;
    }
	
	public function getEstructuraRegistro($id, $ext = false)
    {
        $arrEntidad = $this->objEstructuraService->getHijosEstructura($id);
       // print_r($arrEntidad);die;
        $array = array();
        foreach ($arrEntidad as &$v) {
           if ($v->idconcepto !=10 && $v->idconcepto != 7) {
               /*if($v->idconcepto == 3){
                   $v->checked=false;
               }*/
               $v->checked=false;
               $array[] = $v;
            }

        }
        return $array;
	}
    public function getHijosEstructurasEntidades($idestructura){
        $arrEntidad = $this->objEstructuraService->getHijosEstructura($idestructura);
       // print_r($arrEntidad);die;
        $list = array();
        if (($arrEntidad[0]->id==$arrEntidad[0]->_parent)&&(!$arrEntidad[1])&&($arrEntidad[0]->idconcepto==3)) {
            array_push($list,$idestructura);
            return $list;
        }
        foreach ($arrEntidad as $valueEntidad) {
            $list1 = $this->getHijosEstructurasEntidades($valueEntidad->id);
            foreach ($list1 as $value1) {
                array_push($list, $value1);
            }
        }

        array_push($list, $idestructura);
        return $list;

    }


}

