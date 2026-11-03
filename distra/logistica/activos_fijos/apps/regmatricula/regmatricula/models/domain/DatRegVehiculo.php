<?php

/**
 * Created by JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 11/03/15
 * Time: 8:26
 * To change this template use File | Settings | File Templates.
 */
class DatRegVehiculo extends BaseDatRegVehiculo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTipoTramite', array('local' => 'idtipotramite', 'foreign' => 'idtipotramite'));
        $this->hasMany('DatVehiculoTipoTramite',
            array('local' => 'idregistrovehiculo', 'foreign' => 'idregistrovehiculo'));
        $this->hasMany('NomColor', array('local' => 'idcolorchapa', 'foreign' => 'idcolor'));
        $this->hasMany('NomTipoChapa', array('local' => 'idtipochapa', 'foreign' => 'idtipochapa'));
        // $this->hasMany('per', array('local' => 'idpersona', 'foreign' => ''));
        //  $this->hasMany('estruc', array('local' => 'idestructura', 'foreign' => ''));
        $this->hasMany('NomSectorRegMatric', array('local' => 'idsector', 'foreign' => 'idsector'));
        $this->hasOne('DatInspectorMatricula',
            array('local' => 'idinspectormatricula', 'foreign' => 'idinspectormatricula'));
        $this->hasMany('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
    }

}
