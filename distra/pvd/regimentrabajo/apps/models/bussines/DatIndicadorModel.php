<?php

class DatIndicadorModel extends ZendExt_Model
{
    protected $objRegimen;

    protected $response;

    function __construct()
    {
        $this->objRegimen = new DatIndicador();
        $this->objRegimenBase = new NomCausa();
        $this->objCausaIndicador = new DatIndicadoresporreporte();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public static function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     * @throws Exception
     */
    public function getTodosIndicadores($filtro, $limit, $start)
    {
        $arrayI = $this->objRegimen->getTodosIndicadores($filtro/*, $limit, $start*/);
        $arrayIB = $this->objRegimenBase->GetLeafs();
        $arraydatos = array();
        $arraydatos1 = array();
        $cont = 1;
        foreach ($arrayI as $k => $indicador) {
            $indicadorTemporal = array(
                'id' => $cont,
                'idindicador' => $indicador['idindicador'],
                'denominacion' => $indicador['denominacion'],
                'descripcion' => $indicador['descripcion'],
                'unidadmedida' => $indicador['unidadmedida'],
                'idexpresionmatematica' => $indicador['idexpresionmatematica'],
                'gestionable' => $indicador['gestionable'],
                'causa' => 0,
                'formula' => (empty($indicador['idexpresionmatematica']))? 0 : 1
            );

            if($indicador['fdesde']!=null) {
                $indicadorTemporal['fdesde'] = $indicador['fdesde'];
            }
            else
                $indicadorTemporal ['fechaterminacionvista'] ='';

            if($indicador['fhasta']!=null) {
                $indicadorTemporal ['fhasta'] = $indicador['fhasta'];
            }
            else
                $indicadorTemporal ['fhasta'] ='';

            array_push($arraydatos, $indicadorTemporal);
            $cont++;
        }
        foreach ($arrayIB as $k => $indicador1) {
            $indicadorTemporal2 = array(
                'id' => $cont,
                'idindicador' => $indicador1['idcausa'],
                'denominacion' => $indicador1['denominacion'],
                'descripcion' => $indicador1['descripcion'],
                'causa' => 1,
                'formula' => 0
            );

            if($indicador1['fdesde']!=null) {
                $indicadorTemporal2['fdesde'] = $indicador1['fdesde'];
            }
            else
                $indicadorTemporal2['fechaterminacionvista'] ='';

            if($indicador1['fhasta']!=null) {
                $indicadorTemporal2['fhasta'] = $indicador1['fhasta'];
            }
            else
                $indicadorTemporal2['fhasta'] ='';
            array_push($arraydatos1, $indicadorTemporal2);
            $cont++;
        }
        $result=$this->ConcatenarArray($arraydatos,$arraydatos1);
        $this->response->data =$result;
        $this->response->quantity=count($result);
       return $this->response;
    }

    public function getIndicadoresReporte($idreporte,$filtro, $limit, $start)
    {
        $arrayI = $this->objCausaIndicador->getIndicadores($idreporte,$filtro, $limit, $start);

        $arrayIB = $this->objCausaIndicador->getIndicadoresCausa($idreporte,$filtro, $limit, $start);
//        print_r($arrayI);die;
        $arraydatos = array();
        $arraydatos1 = array();
        $cont = 1;
        foreach ($arrayI as $k => $indicador) {
//            $arraydatos[$k]['idindicador'] = $estudio['idindicador'];
//            $arraydatos[$k]['denominacion'] = $estudio['denominacion'];
//            $arraydatos[$k]['descripcion'] = $estudio['descripcion'];
//            $arraydatos[$k]['unidadmedida'] = $estudio['unidadmedida'];
//            $arraydatos[$k]['idexpresionmatematica'] = $estudio['idexpresionmatematica'];
//            $arraydatos[$k]['orden'] = (int)$estudio['orden'];
//            $arraydatos[$k]['formula'] = 1;
//
//            if($estudio['fdesde']!=null) {
//                $arraydatos[$k]['fdesde'] = $estudio['fdesde'];
//            }
//            else
//                $arraydatos[$k]['fechaterminacionvista'] ='';
//
//            if($estudio['fhasta']!=null) {
//                $arraydatos[$k]['fhasta'] = $estudio['fhasta'];
//            }
//            else
//                $arraydatos[$k]['fhasta'] ='';

            $indicadorTemporal = array(
                'id' => $cont,
                'idindicador' => $indicador['idindicador'],
                'denominacion' => $indicador['denominacion'],
                'descripcion' => $indicador['descripcion'],
                'unidadmedida' => $indicador['unidadmedida'],
                'idexpresionmatematica' => $indicador['idexpresionmatematica'],
                'gestionable' => $indicador['gestionable'],
                'causa' => 0,
                'formula' => (empty($indicador['idexpresionmatematica']))? 0 : 1
            );

            if($indicador['fdesde']!=null) {
                $indicadorTemporal['fdesde'] = $indicador['fdesde'];
            }
            else
                $indicadorTemporal ['fechaterminacionvista'] ='';

            if($indicador['fhasta']!=null) {
                $indicadorTemporal ['fhasta'] = $indicador['fhasta'];
            }
            else
                $indicadorTemporal ['fhasta'] ='';

            array_push($arraydatos, $indicadorTemporal);
            $cont++;

        }

        foreach ($arrayIB as $k => $indicador1) {
//            $arraydatos1[$k]['idindicador'] = $indicador1['idcausa'];
//            $arraydatos1[$k]['denominacion'] = $indicador1['denominacion'];
//            $arraydatos1[$k]['descripcion'] = $indicador1['descripcion'];
//            $arraydatos1[$k]['formula'] = 2;
//            $arraydatos1[$k]['orden'] = (int)$indicador1['orden'];
//            if($indicador1['fdesde']!=null) {
//                $arraydatos1[$k]['fdesde'] = $indicador1['fdesde'];
//            }
//            else
//                $arraydatos1[$k]['fechaterminacionvista'] ='';
//
//            if($indicador1['fhasta']!=null) {
//                $arraydatos1[$k]['fhasta'] = $indicador1['fhasta'];
//            }
//            else
//                $arraydatos1[$k]['fhasta'] ='';

            $indicadorTemporal2 = array(
                'id' => $cont,
                'idindicador' => $indicador1['idcausa'],
                'denominacion' => $indicador1['denominacion'],
                'descripcion' => $indicador1['descripcion'],
                'causa' => 1,
                'formula' => 0
            );

            if($indicador1['fdesde']!=null) {
                $indicadorTemporal2['fdesde'] = $indicador1['fdesde'];
            }
            else
                $indicadorTemporal2['fechaterminacionvista'] ='';

            if($indicador1['fhasta']!=null) {
                $indicadorTemporal2['fhasta'] = $indicador1['fhasta'];
            }
            else
                $indicadorTemporal2['fhasta'] ='';
            array_push($arraydatos1, $indicadorTemporal2);
            $cont++;
        }
        $result=$this->ConcatenarArray($arraydatos,$arraydatos1);
        $this->response->data =$result;
        $this->response->quantity=count($result);
        return $this->response;
    }

    public function getVistaReporte($idreporte,$filtro, $limit, $start)
    {
        $arrayI = $this->objCausaIndicador->getIndicadores($idreporte,$filtro, $limit, $start);
        $arrayIB = $this->objCausaIndicador->getIndicadoresCausa($idreporte,$filtro, $limit, $start);
        $arraydatos = array();
        $arraydatos1 = array();
        foreach ($arrayI as $k => $estudio) {
            $arraydatos[$k]['idindicador'] = $estudio['idindicador'];
            $arraydatos[$k]['denominacion'] = $estudio['denominacion'];
            $arraydatos[$k]['descripcion'] = $estudio['descripcion'];
            $arraydatos[$k]['unidadmedida'] = $estudio['unidadmedida'];
            $arraydatos[$k]['idexpresionmatematica'] = $estudio['idexpresionmatematica'];
            $arraydatos[$k]['orden'] = (int)$estudio['orden'];
            $arraydatos[$k]['formula'] = 1;
            if($estudio['fdesde']!=null) {
                $arraydatos[$k]['fdesde'] = $estudio['fdesde'];
            }
            else
                $arraydatos[$k]['fechaterminacionvista'] ='';

            if($estudio['fhasta']!=null) {
                $arraydatos[$k]['fhasta'] = $estudio['fhasta'];
            }
            else
                $arraydatos[$k]['fhasta'] ='';
        }
        foreach ($arrayIB as $k => $indicador1) {
            $arraydatos1[$k]['idindicador'] = $indicador1['idcausa'];
            $arraydatos1[$k]['denominacion'] = $indicador1['denominacion'];
            $arraydatos1[$k]['descripcion'] = $indicador1['descripcion'];
            $arraydatos1[$k]['formula'] = 2;
            $arraydatos1[$k]['orden'] = (int)$indicador1['orden'];
            if($indicador1['fdesde']!=null) {
                $arraydatos1[$k]['fdesde'] = $indicador1['fdesde'];
            }
            else
                $arraydatos1[$k]['fechaterminacionvista'] ='';
            if($indicador1['fhasta']!=null) {
                $arraydatos1[$k]['fhasta'] = $indicador1['fhasta'];
            }
            else
                $arraydatos1[$k]['fhasta'] ='';
        }
        $result=$this->ConcatenarArray($arraydatos,$arraydatos1);
        $this->response->data =$result;
        $this->response->quantity=count($result);
        return $this->response;
    }

    public function getIndicadoresFormula($idreporte,$filtro, $limit, $start)
    {
        $arrayI = $this->objRegimen->getTodosIndicadores($filtro, $limit, $start);
        $arraydatos = array();
        foreach ($arrayI as $k => $estudio) {
            $arrayId = array();
            $arraydatos[$k]['idindicador'] = $estudio['idindicador'];
            $arraydatos[$k]['denominacion'] = $estudio['denominacion'];
            $arraydatos[$k]['descripcion'] = $estudio['descripcion'];
            $arraydatos[$k]['unidadmedida'] = $estudio['unidadmedida'];
            $arraydatos[$k]['idexpresionmatematica'] = $estudio['idexpresionmatematica'];
            $arraydatos[$k]['gestionable'] = $estudio['gestionable'];
            if($estudio['idexpresionmatematica']) {
                array_push($arrayId, $estudio['idexpresionmatematica']);
                $ioc = ZendExt_IoC_Inter::getInstance();
                $rExpMat =
                    $ioc->comun->BuscarTodosporarrIdExpresionMatematica($arrayId);
                $arraydatos[$k]['formula'] = 1;
                $arraydatos[$k]['denidexpresionmatematica'] =
                    $rExpMat[0]['expresionamostrar'];
            }
            if($estudio['fdesde']!=null) {
                $arraydatos[$k]['fdesde'] = $estudio['fdesde'];
            }
            else
                $arraydatos[$k]['fechaterminacionvista'] ='';

            if($estudio['fhasta']!=null) {
                $arraydatos[$k]['fhasta'] = $estudio['fhasta'];
            }
            else
                $arraydatos[$k]['fhasta'] ='';
        }
        $this->response->data =$arraydatos;
        $this->response->quantity=count($arraydatos);
        return $this->response;
    }

    public function getIndicadoresNoGestionables($idreporte,$filtro, $limit, $start)
    {
        $arrayI = $this->objRegimen->getIndicadoresNoGestionables($filtro, $limit, $start);
        $arraydatos = array();
        foreach ($arrayI as $k => $estudio) {
            $arrayId = array();
            $arraydatos[$k]['idindicador'] = $estudio['idindicador'];
            $arraydatos[$k]['denominacion'] = $estudio['denominacion'];
            $arraydatos[$k]['descripcion'] = $estudio['descripcion'];
            $arraydatos[$k]['unidadmedida'] = $estudio['unidadmedida'];
            $arraydatos[$k]['idexpresionmatematica'] = $estudio['idexpresionmatematica'];
            $arraydatos[$k]['gestionable'] = $estudio['gestionable'];
            if($estudio['idexpresionmatematica']) {
                array_push($arrayId, $estudio['idexpresionmatematica']);
                $ioc = ZendExt_IoC_Inter::getInstance();
                $rExpMat =
                    $ioc->comun->BuscarTodosporarrIdExpresionMatematica($arrayId);
                $arraydatos[$k]['formula'] = 1;
                $arraydatos[$k]['denidexpresionmatematica'] =
                    $rExpMat[0]['expresionamostrar'];
            }
            if($estudio['fdesde']!=null) {
                $arraydatos[$k]['fdesde'] = $estudio['fdesde'];
            }
            else
                $arraydatos[$k]['fechaterminacionvista'] ='';

            if($estudio['fhasta']!=null) {
                $arraydatos[$k]['fhasta'] = $estudio['fhasta'];
            }
            else
                $arraydatos[$k]['fhasta'] ='';
        }
        $this->response->data =$arraydatos;
        $this->response->quantity=count($arraydatos);
        return $this->response;
    }

    public function ConcatenarArray($arraydatos, $arraydatos1)
    {
        $ArrayTotal = array();
        foreach ($arraydatos as $k => $estudio) {
           array_push($ArrayTotal,$arraydatos[$k]);
        }
        foreach ($arraydatos1 as $k1 => $indicador1) {
        array_push($ArrayTotal,$arraydatos1[$k1]);
        }
        return $ArrayTotal;
    }

    public function addReporte($arregloIndicadores, $arregloIndicadoresC,$denominacion,$descripcion,$fdesde,$fhasta,$reporte)
    {
//        print_r($arregloIndicadoresC);die;
        $obj = new NomReporte();
        $obj->denominacion = $denominacion;
        $obj->descripcion = $descripcion;
        $obj->fdesde = $fdesde;
        $obj->fhasta = $fhasta;
        $obj->save();
        $idreporte=$obj->idreporte;
        foreach ($arregloIndicadores as $sesion) {
            $obj1 = new DatIndicadoresporreporte();
            $obj1->idindicador=$sesion->idindicador;
            $obj1->orden=$sesion->orden;
            $obj1->idreporte=$idreporte;
            $obj1->save();
        }
        foreach ($arregloIndicadoresC as $sesion) {
            $obj1 = new DatIndicadoresporreporte();
            $obj1->idcausa=$sesion->idindicador;
            $obj1->orden=$sesion->orden;
            $obj1->idreporte=$idreporte;
            $obj1->save();
        }
    }

    public function modReporte($arregloIndicadores, $arregloIndicadoresC,$denominacion,$descripcion,$fdesde,$fhasta,$reporte)
    {
//
        $obj1 = Doctrine :: getTable('NomReporte')->findBySql("denominacion ='".$denominacion."' and idreporte <> ".$reporte);
//        print_r($obj1->count());die;
        if($obj1->count() == 0){
            $obj = Doctrine :: getTable('NomReporte')->findOneBy('idreporte', $reporte);
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            $idreporte=$reporte;
            $a=DatIndicadoresporreporte::delIndicadoresReporte($idreporte);
            foreach ($arregloIndicadores as $sesion) {
                $obj1 = new DatIndicadoresporreporte();
                $obj1->idindicador=$sesion->idindicador;
                $obj1->orden=$sesion->orden;
                $obj1->idreporte=$idreporte;
                $obj1->save();
            }
            foreach ($arregloIndicadoresC as $sesion) {
                $obj1 = new DatIndicadoresporreporte();
                $obj1->idcausa=$sesion->idindicador;
                $obj1->orden=$sesion->orden;
                $obj1->idreporte=$idreporte;
                $obj1->save();
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    public function eliminarReporte($arrreporte)
    {
        try {
            foreach ($arrreporte as $val) {
                $obj = NomReporte::getByid($val->idreporte);
                $result = DatIndicadoresporreporte::delIndicadoresReporte($val->idreporte);
                if($result)
                    $obj->delete();
            }
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 3;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function addIndicador($idindicador,$denominacion,$descripcion,$fdesde,$fhasta,$unidadmedida,$idexpresionmatematica)
    {
        $obj = new DatIndicador();
        $obj->denominacion = $denominacion;
        $obj->descripcion = $descripcion;
        $obj->fdesde = $fdesde;
        $obj->fhasta = $fhasta;
        $obj->unidadmedida = $unidadmedida;
        $obj->idexpresionmatematica = $idexpresionmatematica;
        $obj->save();
    }

    public function modIndicador($idindicador,$denominacion,$descripcion,$fdesde,$fhasta,$unidadmedida,$idexpresionmatematica)
    {
        $obj = Doctrine :: getTable('DatIndicador')->find($idindicador);
        $obj->denominacion = $denominacion;
        $obj->descripcion = $descripcion;
        $obj->fdesde = $fdesde;
        $obj->fhasta = $fhasta;
        $obj->unidadmedida = $unidadmedida;
        $obj->idexpresionmatematica = $idexpresionmatematica;
        $obj->save();
    }

    public function eliminarIndicador($arrindicador)
    {
        try {
            foreach ($arrindicador as $val) {
                $obj = DatIndicador::getByid($val->idindicador);
                $obj->delete();
            }
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 3;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }



}

