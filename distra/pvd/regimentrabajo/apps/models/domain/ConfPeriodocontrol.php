<?php

class ConfPeriodocontrol extends BaseConfPeriodocontrol
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idperiodocontrol)
    {
        return Doctrine::getTable('ConfPeriodocontrol')->find($idperiodocontrol)->toArray();
    }

	/*
     * Obtener un listado de los datos
     */	   
	public function obtenerListadoPeriodoControl($inicio = 0, $limite = 15, $fdesde, $fhasta)
    {
        $sql = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc offset $inicio limit $limite";

        $sqldesde = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc
                WHERE '$fdesde' BETWEEN pc.fdesde
                AND pc.fhasta offset $inicio limit $limite";

        $sqlhasta = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc
                WHERE '$fhasta' BETWEEN pc.fdesde
                AND pc.fhasta offset $inicio limit $limite";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if(!empty($fdesde)){
            $r = $conn->fetchAll($sqldesde);
        }else if(!empty($fhasta)){
            $r = $conn->fetchAll($sqlhasta);
        }else
            $r = $conn->fetchAll($sql);
        return $r;
    }

	
	 /*
     * Obtener la cantidad total
     */
	public static function obtenerCantidadTotalPeriodoControl() {
        //Devolviendo la cantidad total
        return Doctrine_Query::create()
			->select('COUNT(idperiodocontrol) AS cantidad')
			->from('ConfPeriodocontrol')
			->fetchOne()
		->cantidad;
    }

    public static function Getrangofechasdesde($fdesde, $fhasta)
    {
        $sql = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc
                WHERE pc.fdesde BETWEEN '$fdesde' AND '$fhasta'";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public static function Getrangofechashasta($fdesde, $fhasta){

        $sql = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc
                WHERE pc.fhasta BETWEEN '$fdesde' AND '$fhasta'";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public static function Getrangofechasdesde1($fdesde)
    {
        $sql = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc
                WHERE '$fdesde' BETWEEN pc.fdesde
                AND pc.fhasta;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public static function Getrangofechashasta1($fhasta)
    {
        $sql = "SELECT *
                FROM mod_regimentrabajo.conf_periodocontrol as pc
                WHERE '$fhasta' BETWEEN pc.fdesde
                AND pc.fhasta;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }



}

