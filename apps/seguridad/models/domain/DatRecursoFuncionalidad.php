<?php
/**
 * Created by PhpStorm.
 * User: lily
 * Date: 3/9/16
 * Time: 2:54 p.m.
 */
class DatRecursoFuncionalidad extends BaseDatRecursoFuncionalidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRecurso',
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
        $this->hasOne(
            'DatFuncionalidad',
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
    }

    static public function obtenerRecursosHeredadosByIdFuncionalidad($idfuncionalidad,$limit=null,$start=null)
    {
        $query = Doctrine_Query::create();
        if($limit){
            $datos = $query->select('rf.idrecurso, rf.externo')
                ->from('DatRecursoFuncionalidad rf')
                ->where("rf.idfuncionalidad = ?", $idfuncionalidad)
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        else{
            $datos = $query->select('rf.idrecurso, rf.externo')
                ->from('DatRecursoFuncionalidad rf')
                ->where("rf.idfuncionalidad = ?", $idfuncionalidad)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $datos;
    }

    static public function eliminarRecursos($idrecurso, $idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $datos = $query->delete()
            ->from('DatRecursoFuncionalidad r')
            ->where("r.idrecurso = ? and r.idfuncionalidad = ?", array($idrecurso, $idfuncionalidad))
            ->execute();
        return $datos;
    }


    static public function comprobarRecursoHeredadoByIdFuncIdRec($idfuncionalidad, $idrecurso){
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso')
            ->from('DatRecursoFuncionalidad r')
            ->where("r.idfuncionalidad = ? and r.idrecurso = ?", array($idfuncionalidad, $idrecurso))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function actualizarValorExternoRecurso($idrecurso, $externo){

        $query = Doctrine_Query::create();
        $externo = $externo ? "true" : "false";
        return $query->update('DatRecursoFuncionalidad rf')
                ->set('rf.externo', $externo)
                ->where("rf.idrecurso = ?", $idrecurso)
                ->execute();



    }

}