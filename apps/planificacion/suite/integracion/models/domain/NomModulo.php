<?php

/**
 * @author
 * @version
 * @copyright
 */
class NomModulo extends BaseNomModulo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTipoConcepto',
            array('local' => 'idmodulo', 'foreign' => 'idmodulo')
        );
		$this->hasMany(
            'DatIntegracion',
            array('local' => 'idmodulo', 'foreign' => 'idmodulofuente')
        );
		$this->hasMany(
            'DatIntegracion',
            array('local' => 'idmodulo', 'foreign' => 'idmodulodestino')
        );
        
    }




    public function CargarAreasNegocio($parametros){
        $objConex = Doctrine_Manager:: connection();

        $cadenaSql = "SELECT * FROM mod_planifplataforma.nom_modulo m ";

        //if()

        $cadenaSql.= " WHERE m.instalado = 1 ";

        $resultado = $objConex->execute($cadenaSql)->fetchAll();
        return $resultado;
    }


}

//fin clase 



