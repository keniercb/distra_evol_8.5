<?php

class ConfprendanormaModel extends ZendExt_Model
{
    protected $objAsigdefensa;
    protected $response;

    function __construct()
    {
        $this->obj = new Confprendanorma();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getConfiguracion( $filtro,
        $limit, $start , $value)
    {

        try {
            $response->data = $this->obj->getConfiguracion($filtro,
                $limit, $start ,$value);
            //print_r($response->data);die;
            $response->quantity = $this->obj->getCantConfiguracion( $filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function  addConfiguracion($objAsi)
    {
        try {
            $find = Doctrine :: getTable('Confprendanorma')->findByDql("idprenda = ? and idnorma = ? and idtalla=?", array($objAsi->idprenda, $objAsi->idnorma, $objAsi->idtalla))->getFirst();
             if (!$find) {
            $obj = new Confprendanorma();
            foreach ($objAsi as $k => $v) {
                $obj->$k = $v;
            }
            $obj->save();

            return $obj->idconftallaje;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modConfiguracion($idnomenclador, $idprenda, $idnorma, $idtalla)
    {
        //  print_r($idprenda);die;
        try {
            $find = Doctrine :: getTable('Confprendanorma')->findByDql("idprenda = ? and idnorma = ? and idtalla=?", array($idprenda, $idnorma, $idtalla))->getFirst();
           // print_r($find);die;
            if ($find) {
                return false;
            } else {
                $result = $this->obj->modConfiguracion($idnomenclador, $idprenda, $idnorma, $idtalla);
                return true;
            }

        } catch (Exception $exc) {
            throw $exc;
        }
    }

         public function delConfiguracion($arrids)
         {
             try {
                 $query = Doctrine_Query::create();
                 $query->from('Confprendanorma');
                 if (is_array($arrids)) {
                     $query->whereIn('idconftallaje', $arrids);
                 } elseif (is_numeric($arrids)) {
                     $query->where('idconftallaje = ?', $arrids);
                 }
                 $result = $query->execute();
                 if ($result->delete()) {
                     $r['exception'] = 0;
                 }

                 return $r;
                 // return $query->execute()->delete();
             } catch (Doctrine_Exception $e) {
                 if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                     $r['exception'] = 1;

                     return $r;
                 } else {
                     throw $e;
                 }
             }
         }
}

