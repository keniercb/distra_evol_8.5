<?php

class DatValorescampostipoubicacion extends BaseDatValorescampostipoubicacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEstructuraubicacion',
            array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne('NomUnidadmedida', array('local' => 'idunidadmedida', 'foreign' => 'idunidadmedida'));
        $this->hasOne('NomIndicador', array('local' => 'idproducto', 'foreign' => 'idindicador'));
    }

    /**
     * Verifica si existen los valores de ubicacion en la estructura.
     * @return boolean
     */
    public function existenCampos($idestructuraubicacion)
    {
        $resCant = Doctrine_Query::create()
            ->select('count(v.idestructuraubicacion) as cant')
            ->from('DatValorescampostipoubicacion v')
            ->where('v.idestructuraubicacion = ?', $idestructuraubicacion)
            ->fetchArray();
        return $resCant[0]['cant'] != 0;
    }

    /**
     * Funcion para determinar la capacidad Total de la estructura de ubicación
     *
     * @param $idestructuraubicacion -Identificador de la estructura ubicación
     *
     * @return Retorna los campos existentes
     * author Yoandi Díaz Ramos
     * @versión 1.0
     */
    public function getCapacidadTotal($idestructuraubicacion)
    {
        $query = Doctrine_Query::create()
            ->select('dvc.capacidad')
            ->from('DatValorescampostipoubicacion dvc')
            ->where('dvc.idestructuraubicacion = ?', $idestructuraubicacion);
        return $query->fetchArray();
    }

    /**
     * Funcion para determinar el volumen Total de la estructura de ubicación
     *
     * @param $idestructuraubicacion -Identificador de la estructura ubicación
     *
     * @return Retorna los campos existentes
     * author Yoandi Díaz Ramos
     * @versión 1.0
     */
    public function getVolumenTotal($idestructuraubicacion)
    {
        $query = Doctrine_Query::create()
            ->select('(dvc.ancho * dvc.alto * dvc.largo) AS volumen')
            ->from('DatValorescampostipoubicacion dvc')
            ->where('dvc.idestructuraubicacion = ?', $idestructuraubicacion);
        return $query->fetchArray();
    }

    /**
     * Funcion para determinar el peso Total de la estructura de ubicación.
     *
     * @param $idestructuraubicacion -Identificador de la estructura ubicación.
     *
     * @return Retorna los campos existentes
     * author Yoandi Díaz Ramos
     * @versión 1.0
     */
    public function getPesoTotal($idestructuraubicacion)
    {
        $query = Doctrine_Query::create()
            ->select('dvc.peso')
            ->from('DatValorescampostipoubicacion dvc')
            ->where('dvc.idestructuraubicacion = ?', $idestructuraubicacion);
        return $query->fetchArray();
    }

}
