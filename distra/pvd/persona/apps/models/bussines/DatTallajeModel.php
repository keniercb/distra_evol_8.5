<?php

/**
 * Class DatTallajeModel
 */
class DatTallajeModel extends ZendExt_Model implements IConceptoExport
{
    protected $objTallaje, $response;

    function __construct()
    {
        $this->objTallaje = new DatTallaje();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTallajesByPersona($idpersona, $limit = 0, $start = 0)
    {
        try {
            $this->response->data = $this->objTallaje->getTallajesByPersona(
                Utiles::reflectArray($idpersona), $limit, $start
            );
            $this->response->quantity = ($limit > 0) ? $this->objTallaje->getCantTallajesByPersona(
                Utiles::reflectArray($idpersona)
            ) : count($this->response->data);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTallajesAll($idprenda)
    {
        try {
            $this->response->data = $this->objTallaje->getTallajesAll($idprenda);

            foreach($this->response->data as $key=>$a){
                $this->response->data[$key]['idprenda']=$a['idprenda'];
                $this->response->data[$key]['idnorma']=$a['idnorma'];
                $this->response->data[$key]['idtalla']=$a['idtalla'];
                $this->response->data[$key]['idtallaje']=$a['idtallaje'];
                $this->response->data[$key]['denomnorma']=$a['denomnorma'];
                $this->response->data[$key]['denomprenda']=$a['denomprenda'];
                $this->response->data[$key]['denomtalla']=$a['denomtalla'];
                $this->response->data[$key]['idpersona']=$a['idpersona'];
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($a['idpersona']),null,null,null,null,null);
                $this->response->data[$key]['nombreyapellidos']=$persona->data[0]['nombreapellidos'];
                $this->response->data[$key]['numid']=$persona->data[0]['numid'];
                $this->response->data[$key]['cargo']=$persona->data[0]['denomcargo'];
                $this->response->data[$key]['idcargo']=$persona->data[0]['idcargo'];
            }

           $this->response->quantity = count($this->response->data);
          //  print_r( $this->response);die;

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }
    public function getCantTallasbyPersona($idprenda)
    {
        try {
            $this->response->data = $this->objTallaje->getTallajesAll($idprenda);
            $obj=new NomTallaModel();
            $size=$obj->getActiveSize();

            $tallas= Array();

            foreach($size->data as $k=>$i){
                $tallas[$k]=$i['idtalla'];
            }
            $nuevo=array_unique($tallas);
            $otro=array_values($nuevo);

            $resultado = Array();
            foreach($this->response->data as $key=>$a){
                $resultado[$key]=$a['idtalla'];
            }
            $arrayfinal = array();
            $cant = 0 ;
            for($i=0;$i<count($otro);$i++){
                for($j=0;$j<count($resultado);$j++){
                   if($otro[$i] == $resultado[$j]){
                       $cant++;
                   }
                }
                if($cant>0){
                    $arrayfinal[$i]="$cant";
                }
                else
                {
                    $arrayfinal[$i]=$cant;
                }

                $cant = 0 ;
            }
            return $arrayfinal;
        } catch (Exception $e) {
            throw $e;
        }
    }


    public function addTallaje(array $data, $idpersona)
    {
        try {
            $collection = new Doctrine_Collection('DatTallaje');
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            $collection->save();
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modTallaje(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objTallaje->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idtallaje] as $k => $val) {
                            $collection[$p]->$k = $val;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delTallaje($id, $idpersona)
    {
        try {
            $this->objTallaje->delTallaje(Utiles::reflectArray($id), Utiles::reflectArray($idpersona));
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dtall.*')->leftJoin($baseAlias . '.DatTallaje dtall');
    }
}