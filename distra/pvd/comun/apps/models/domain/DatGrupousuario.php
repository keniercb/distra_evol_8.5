<?php

class DatGrupousuario extends BaseDatGrupousuario
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne ('DatGrupo', array ('local' => 'idgrupo', 'foreign' => 'idgrupo'));
    }

    public function getByid($idgrupousuario)
    {
        return Doctrine::getTable('DatGrupousuario')->find($idgrupousuario)->toArray();
    }

    public function getTodosUserCompartimentados(){
        $q = Doctrine_Query::create();
        $result = $q->from('DatGrupousuario dgu')
            ->innerJoin('dgu.DatGrupo dg')
            ->execute();
        return $result->toArray();
    }

    public function getGrupousuariosbyArrIds(array $arr){
        $q = Doctrine_Query::create();
        $result = $q->select('idgrupousuario, idusuario, idgrupo')
                ->from('DatGrupousuario')
                ->whereIn('idusuario',$arr)
                ->execute();
        return $result;
    }

    public function getTodosUsers($start, $limit){
        $q = Doctrine_Query::create();
        $result = $q->select('dgu.idgrupousuario, dgu.idusuario, dgu.idgrupo, dgu.idpersona, dg.compartimentacion as compartimentacion, dg.denominacion as denominacion')
            ->from('DatGrupousuario dgu')
            ->innerJoin('dgu.DatGrupo dg')
            ->offset($start)
            ->limit($limit)
            ->execute();
        return $result->toArray();
    }

    public function getCantTotalUsers(){
        $q = Doctrine_Query::create();
        $result = $q->from('DatGrupousuario dgu')
            ->innerJoin('dgu.DatGrupo dg')
            ->count();
        return $result;
    }

    public function getCompartimentacion($idusuario){
        $q = Doctrine_Query::create();
        $result = $q->select('idgrupo')
                ->from('DatGrupousuario')
                ->where("idusuario = ?",$idusuario)
                ->execute();
        return $result->toArray();
    }

    public function eliminarbyIds($arr){
        try{
            $q = Doctrine_Query::create();
            if(is_array($arr)){
                $result = $q->from("DatGrupousuario")
                    ->whereIn('idgrupousuario',$arr)
                    ->execute();
            }else{
                $result = $q->from("DatGrupousuario")
                    ->where("idgrupousuario = ?", $arr)
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

