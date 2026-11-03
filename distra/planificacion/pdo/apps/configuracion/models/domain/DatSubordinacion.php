<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatSubordinacion extends BaseDatSubordinacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerTodosLosJefes($idsubordinado)
    {
        $query = new Doctrine_Query();
        $result = $query->select('s.*')
            ->from('DatSubordinacion s')
            ->where('s.idhijo = ?', $idsubordinado)
            ->execute();
        return $result->toArray();
    }
    
    public function eliminarSubordinados($idSubordinado) 
    {
        $consulta = "DELETE FROM mod_objetivos.dat_subordinacion s
                    WHERE s.idpadre = $idSubordinado OR s.idhijo = $idSubordinado";
        $conn = Doctrine_Manager:: connection();
        $conn->execute($consulta);
    }


}//fin clase 




