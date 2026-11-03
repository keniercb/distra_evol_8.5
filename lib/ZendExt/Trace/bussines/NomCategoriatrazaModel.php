<?php
/* 
* Esta clase ha sido generada por Doctrine Generator 
*/
class NomCategoriatrazaModel extends ZendExt_Model
{
    public function NomCategoriatrazaModel()
    {
        parent::ZendExt_Model();
    }

    public function Insertar($nomCategoriaTraza)
    {
        $nomCategoriaTraza->save();
    }

    public function Actualizar($nomCategoriaTraza)
    {
        $nomCategoriaTraza->save();
    }

    public function Eliminar($nomCategoriaTraza)
    {
        $nomCategoriaTraza->delete();
    }
}


