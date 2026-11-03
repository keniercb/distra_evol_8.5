<?php

class NomActividadInversionesSisplanModel extends NomActividadModel {
   
    public function listarActividadesInversiones($params){
        $actividad = new NomActividadInversionesSisplan();
       return $actividad->listarActividadesInversiones($params);

    }

}

//fin clase
?>
