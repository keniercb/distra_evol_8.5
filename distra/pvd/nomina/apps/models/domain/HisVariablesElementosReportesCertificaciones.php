<?php

class HisVariablesElementosReportesCertificaciones extends BaseHisVariablesElementosReportesCertificaciones {

    public function setUp(){
        parent::setUp();
        $this->hasMany('HisReportesCertificaciones', array(
             'local' => 'idelementosreportescertificaciones',
             'foreign' => 'idelementosreportescertificaciones',
             'refClass' => 'HisVariablesElementosReportesCertificaciones'
        ));
  
    }
    
    public static function obtenerVariablesElementosReportesCertificaciones($arrIdsElementos){        
        return Doctrine_Query::create()
                ->from('HisVariablesElementosReportesCertificaciones')
                ->whereIn('idelementosreportescertificaciones', $arrIdsElementos)
                ->fetchArray();
    }
	
	public static function obtenerIdVariablesElementosReportesCertificaciones($idelemento){        
        return Doctrine_Query::create()
                ->select('idhisvariableselementosreportescertificaciones')
                ->from('HisVariablesElementosReportesCertificaciones')
                ->whereIn('idelementosreportescertificaciones', $idelemento)
                ->fetchArray();
    }
    
}