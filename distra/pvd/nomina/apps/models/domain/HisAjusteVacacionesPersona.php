<?php

class HisAjusteVacacionesPersona extends BaseHisAjusteVacacionesPersona {

     public static function obtenerObjHisAjusteVacacionesPersonaDadoId($hisajustevacacionespersona) {
        return Doctrine::getTable('HisAjusteVacacionesPersona')->find($hisajustevacacionespersona);
    }
	




}
