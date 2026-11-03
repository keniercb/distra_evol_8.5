<?php

class DatGrupo extends BaseDatGrupo
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasMany ('DatGrupousuario', array ('local' => 'idgrupo', 'foreign' => 'idgrupo'));
    }

    public function getByid($idgrupo)
    {
        return Doctrine::getTable('DatGrupo')->find($idgrupo)->toArray();
    }

    public static function getTodos(){
        $q = Doctrine_Query::create();
        $result = $q->from('DatGrupo')
                    ->orderBy('idgrupo')
                    ->execute();
        return $result->toArray();
    }

    public static function getCompartimentacion($start, $limit, $busq = null){
        $q = Doctrine_Query::create();
        if($busq!=null){
            $q->where("denominacion ilike '%$busq%'");
        }
        $result = $q->from('DatGrupo')
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy('idgrupo')
                    ->execute();
        return $result->toArray();
    }

    public static function getCantCompartimentaciones($busq = null){
        $q = Doctrine_Query::create();
        if($busq!=null){
            $q->where("denominacion ilike '%$busq%'");
        }
        $result = $q->from('DatGrupo')
                    ->count();
        return $result;
    }

    public static function verficarExisteDenom($denom){
        try{
            $q = Doctrine_Query::create();
            $result = $q->select('denominacion')
                        ->from('DatGrupo')
                        ->where("denominacion ilike '$denom'")
                        ->count();
            return $result;
        }catch (Doctrine_Exception $e){
            throw new $e;
        }
    }

    public function eliminarbyIds($arr){
        try{
            $q = Doctrine_Query::create();
            if(is_array($arr)){
                $result = $q->from("DatGrupo")
                    ->whereIn('idgrupo',$arr)
                    ->execute();
            }else{
                $result = $q->from("DatGrupo")
                    ->where("idgrupo = ?",$arr)
                    ->execute();
            }
            $result->delete();
            return true;
        }catch (Doctrine_Exception $e){
            throw $e;
            return false;
        }
    }
}

