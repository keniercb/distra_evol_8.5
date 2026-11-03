<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NomAgrupacion
 *
 * @author gerardo
 */
class NomAgrupacion extends BaseNomAgrupacion
{

    public function setUp()
    {
        parent::setUp();
    }

    public function cargaragrupaciones($parametros)
    {
        $query = new Doctrine_Query();
        $result = $query->select('nagrp.idagrupacion,
                        nagrp.denominacion')
            ->from('NomAgrupacion nagrp')
            ->fetchArray();
        return $result;
    }

}
