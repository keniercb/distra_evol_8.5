<?php

class NomDatoscodificador extends BaseNomDatoscodificador
{

    public function setUp()
    {
        parent::setUp();
    }

    public function buscarporcodigo($codigo)
    {
        $query = new Doctrine_Query();
        return $query->select('n.denominacion')
            ->from('NomDatoscodificador n')
            ->orWhere('n.codigo = ?', $codigo)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public function obtenerDatosDadoIdtipo($idtipoc)
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT dc.iddatoscodificador, dc.denominacion, dc.codigo, dc.descripcion
                    FROM mod_planificacion.nom_datoscodificador dc
                    WHERE dc.idtipocodificador = ?";
        $result = $conn->execute($query, array($idtipoc))->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

}
