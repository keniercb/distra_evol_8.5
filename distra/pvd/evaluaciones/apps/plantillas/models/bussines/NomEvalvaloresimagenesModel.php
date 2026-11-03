<?php

class NomEvalvaloresimagenesModel extends ZendExt_Model {

    public function setUp() {

        parent::ZendExt_Model();
    }

    public function Insertar(NomEvalvaloresimagenes $NomEvalvaloresimagenes) {
        $NomEvalvaloresimagenes->save();
    }

    public function Actualizar(NomEvalvaloresimagenes $NomEvalvaloresimagenes) {
        $NomEvalvaloresimagenes->save();
    }

    public function Eliminar($idimg, $extension) {
        $obj = Doctrine :: getTable('NomEvalvaloresimagenes')->find($idimg);
        if ($obj) {
            $obj->delete();
            $dirimgs = 'nomvalimgs' . DIRECTORY_SEPARATOR;
            $imagen = $dirimgs . $idimg . $extension;
            if (!unlink($imagen))
                exit('Imposible eliminar el archivo ' . $idimg . $extension . ', compruebe que el fichero exista y que tenga permiso');
            return true;
        }
        return false;
    }

    public function TamannoAdecuado($sesion) {
        $width = $sesion[0];
        $height = $sesion[1];
        if ($width < 200 && $height < 200)
            return true;
        return false;
    }

}

