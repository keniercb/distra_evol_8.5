<?php
class NomEvalrecomendacionModel extends ZendExt_Model
 {
   public function setUp()
    {
        parent::ZendExt_Model();
    }

   public function Insertar(NomEvalrecomendacion $NomEvalrecomendacion)
    {
            $NomEvalrecomendacion->save();
    }

   public function Actualizar(NomEvalrecomendacion $NomEvalrecomendacion)
    {
            $NomEvalrecomendacion->save();
    }

    public function Eliminar($NomEvalrecomendacion)
    {
        $NomEvalrecomendacion->delete();
    }

    public function existeDenominacion($denom){
        return NomEvalrecomendacion :: ExisteDenomRecon($denom);
    }

    public function RecomendacionEnUso($id)
    {
       $valores = NomEvalrecomendacion :: RecomendacionEnUso($id);
       if(!$valores)
            return true;
       return false;
    }
 }

