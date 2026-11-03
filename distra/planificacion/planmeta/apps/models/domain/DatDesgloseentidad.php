<?php

class DatDesgloseentidad extends BaseDatDesgloseentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local'   => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'DatActividadentidad', array('local'   => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
            'DatNecesidaddesglose', array('local'   => 'iddesgloseentidad',
                                          'foreign' => 'iddesgloseentidad')
        );
        $this->hasMany(
            'DatDesgloseentidad',
            array('local' => 'idpadre', 'foreign' => 'iddesgloseentidad')
        );
        $this->hasOne(
            'DatDesglosetiponomenclador',
            array('local'   => 'iddesglosetiponomenclador',
                  'foreign' => 'iddesglosetiponomenclador')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

    public function optenerIdRama($idesglose, $pOrdenDelIddatosnomenclador,
        $iddatosnomenclador, $idcolumnapadre = null
    )
    {
        /* temporal poner este metodo en NomDatosnomenclador */
        $confdesglose = DatDesglose::getDatDesglosetiponomenclador(
            $idesglose, $pOrdenDelIddatosnomenclador
        );
        $query = new Doctrine_Query();
        $totaldatosnom = $query->select(
            'COUNT( m.iddatosnomenclador) as total '
        )->from('NomDatosnomenclador m')
            ->where('m.idtiponomenclador=?', $confdesglose->idtiponomenclador)
            ->execute()->getFirst()->total;


        /* temporal poner este metodo en NomDatosnomenclador */
        $ordendatonom = 0;
        $query = new Doctrine_Query();
        $result = $query->select(' m.iddatosnomenclador ')
            ->from('NomDatosnomenclador m')
            ->where('m.idtiponomenclador=?', $confdesglose->idtiponomenclador)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('m.iddatosnomenclador')->execute();
        /* contar el orden del iddatosnomencaldor, toma por defecto el orden de insercion */
        $_TRUE = true;
        foreach ($result as $valorIddn) {
            if ($_TRUE == true) {
                $ordendatonom++;
            }
            if ($valorIddn['iddatosnomenclador'] . " " == $iddatosnomenclador
                . " "
            ) {
                $_TRUE = false;
            }
        }

        if ($idcolumnapadre == null || $idcolumnapadre == '0') {
            return $ordendatonom; //orden de la columna
        }
        $idcolumna = $totaldatosnom * ($idcolumnapadre - 1) + $ordendatonom;
        return $idcolumna;
    }

    public function buscarDesgloseActEntidadEIdrama(
        $idactividadentidad, $idrama, $iddatosnomenclador,
        $iddesglosetiponomenclador
    )
    {
        $query = new Doctrine_Query();
        return $query->from('DatDesgloseentidad de')
            ->where(
                "idactividadentidad = ? AND idrama = ? AND iddatosnomenclador = ? AND iddesglosetiponomenclador = ?",
                array($idactividadentidad, $idrama, $iddatosnomenclador,
                      $iddesglosetiponomenclador)
            )->execute();
    }

   /* public static function validarExistenciaDatos($idejercicio)
    {
        //Devolviendo la cantidad.
        return Doctrine_Query::create()->select(
            'COUNT(iddesgloseentidad ) AS cantidad'
        )->from('DatDesgloseentidad')->where('idejercicio=?', $idejercicio)
            ->fetchOne()->cantidad;
    }*/

}