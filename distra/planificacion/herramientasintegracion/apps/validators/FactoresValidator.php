<?php

class FactoresValidator
{

    public function validarDenominacion($domain, $denominacion)
    {
        $query = new Doctrine_Query ();
        $denominacion = strtoupper($denominacion);
        $result = $query->from("$domain")->where("UPPER(TRIM(public.sp_ascii(denominacion)))=UPPER(TRIM(public.sp_ascii('{$denominacion}'))) ")->execute();
        $array = $result->toArray();
        if (empty($array))
            return true;
        else
            return false;
    }

    public function validarIntensidad($idestudio, $denominacion, $intensidad)
    {
        $query = new Doctrine_Query ();
        $denominacion = strtoupper($denominacion);
        $result = $query->from("DatIntensidadconflicto")
            ->where("idestudiocurvaconflicto = $idestudio")
            ->andWhere("(UPPER(TRIM(public.sp_ascii(terminologia)))=UPPER(TRIM(public.sp_ascii('{$denominacion}')))) OR nivelintensidad={$intensidad} ")
            ->execute();
        $array = $result->toArray();
        return $array;
    }

    public function validarEstrategia($arreglo)
    {
        $query = new Doctrine_Query ();
        $denominacion = strtoupper($arreglo['denominacion']);
        $experto = json_encode($arreglo['analista']);
        $query->from("DatEstrategia")
            ->Where("(UPPER(TRIM(public.sp_ascii(denominacion)))=UPPER(TRIM(public.sp_ascii('{$denominacion}'))))")
            ->andWhere("idambitodofa={$arreglo['idambitodofa']}")
            ->andWhere("idfactorclave1={$arreglo['idfactorclave1']}")
            ->andWhere("idfactorclave2={$arreglo['idfactorclave2']}")
            ->andWhere("experto={$experto}");
        $query = ($arreglo['idestrategia']) ? $query->andWhere("idestrategia <> {$arreglo['idestrategia']}") : $query;
        $result = $query->execute();
        $array = $result->toArray(); 
        if (empty($array))
            return true;
        else
            return false;
    }

}
