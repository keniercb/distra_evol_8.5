<?php

class NomConceptoaporte extends BaseNomConceptoaporte
{

    public function setUp()
    {
        parent::setUp();
    }

    public function adicionarConcepAporte($parametros)
    {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planificacion.nom_conceptoaporte(denominacion,descripcion,valor,uriconceptoaporte)
                VALUES ('$parametros->denominacion','$parametros->descripcion',$parametros->valor,'$parametros->uriconceptoaporte');";
        $con->execute($sql);
    }

    public function modificarConcepAporte($parametros)
    {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planificacion.nom_conceptoaporte SET denominacion = '$parametros->denominacion',descripcion = '$parametros->descripcion',
                valor = $parametros->valor, uriconceptoaporte = '$parametros->uriconceptoaporte' WHERE idconceptoaporte = $parametros->idconceptoaporte;";
        $con->execute($sql);
    }

    public function listarConcepAporte()
    {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT  idconceptoaporte,denominacion,descripcion, valor,uriconceptoaporte 
                FROM mod_planificacion.nom_conceptoaporte;";
        $result = $con->execute($sql)->fetchAll();
        return $result;
    }

    public function eliminarConcepAporte($parametros)
    {
        $con = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_planificacion.nom_conceptoaporte WHERE idconceptoaporte IN ($parametros->idconceptoaporteseparados);";
        $con->execute($sql);

    }

}
