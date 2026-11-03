<?php

class EscalasService extends ZendExt_Model
{

    public function getConfigEscalaNum($idescala) {
        $aux = DatEvalescalarangonumerico::Buscar($idescala);
        return ZendExt_ClassStandard::ArrayObject($aux);
    }

    public function BuscarEscalaNumerica($id)
    {
        $aux = DatEvalescalarangonumerico::getValoresEscala($id);
        return ZendExt_ClassStandard::ArrayObject($aux);
    }

    public function BuscarEscalaPorId($id)
    {
        $aux = DatEvalescala::GetEscala($id);
        return ZendExt_ClassStandard::ArrayObject($aux);
    }

    public function BuscarValoresnumericos($id)
    {
        $aux = NomEvalvaloresnumericos::BuscarPorId($id);
        return ZendExt_ClassStandard::ArrayObject($aux);
    }

    public function BuscarEscalaVaoresPoridescala($id)
    {

        $aux = DatEvalescalavalorescualitativos::GetEscalaVaoresPoridescala($id);
        return ZendExt_ClassStandard::ArrayObject($aux);
    }

    public function BuscarDemonCualitativoPorId($id)
    {
        $aux = DatEvalescalavalorescualitativos::getDenomPorId($id);
        return ZendExt_ClassStandard::ArrayObject($aux);
    }

    public function ObtenerValoresEscalaPorIndicador($idindicador)
    {
        $aux = DatEvalescalaModel::GetValoresEscala($idindicador);
        return $aux;
    }

    public function GetResultByEscalaValor($idescala, $idvalor)
    {
        $aux = DatEvalescala::GetResultByEscalaValor($idescala, $idvalor);
        return $aux;
    }

}