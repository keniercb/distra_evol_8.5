<?php
class DatEvalrecursoevaluativoModel extends ZendExt_Model
 {
   public function setUp()
    {
        parent::ZendExt_Model();
    }

   public function Insertar(DatEvalrecursoevaluativo $DatEvalrecursoevaluativo)
    {
            $DatEvalrecursoevaluativo->save();
            //return true;
    }

   public function Actualizar(DatEvalrecursoevaluativo $DatEvalrecursoevaluativo)
    {
            $DatEvalrecursoevaluativo->save();
    }

   public function Eliminar($DatEvalrecursoevaluativo)
    {
            $DatEvalrecursoevaluativo->delete();
    }

    public function existeRecurso($denom)
    {
    $existe = DatEvalrecursoevaluativo :: existeRecurso($denom);
    if($existe)
        return true;
    else    
        return false;
    }
 }

