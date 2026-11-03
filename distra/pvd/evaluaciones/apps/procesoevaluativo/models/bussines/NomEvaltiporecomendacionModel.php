<?php
class NomEvaltiporecomendacionModel extends ZendExt_Model
 {
   public function setUp()
    {
        parent::ZendExt_Model();
    }

   public function Insertar(NomEvaltiporecomendacion $NomEvaltiporecomendacion)
    {
            $NomEvaltiporecomendacion->save();
    }

   public function Actualizar(NomEvaltiporecomendacion $NomEvaltiporecomendacion)
    {
            $NomEvaltiporecomendacion->save();
    }

   public function Eliminar($NomEvaltiporecomendacion)
    {
            $NomEvaltiporecomendacion->delete();
    }

	public function existeDenominacion($denom){
		$existe = NomEvaltiporecomendacion :: ExisteDenomTipoRecon($denom);
		if(!$existe){
			return true;
		}else{
			return false;
		}
	}

	public function TipoRecoEnUso($id)
	{
	   $valores = NomEvaltiporecomendacion :: TipoRecomendacionEnUso($id);
	   if(!$valores)
                return true;
	   return false;
	}
 }

