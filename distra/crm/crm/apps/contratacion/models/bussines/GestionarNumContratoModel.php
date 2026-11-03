<?php
class GestionarNumContratoModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    function getNumContrato($params,$contratodestino = null)
    {
        if(!is_array($params))
            throw new Exception("Formato de parámetro incorrecto");

        $contratodestino = $this->verificarContratodestino($contratodestino);
        $formatoData = ConfEntidadFormatoNumContrato::getFormatoNumContratoData($this->global->Estructura->idestructura,$contratodestino);
        $entidadConfig = $formatoData['ConfEntidadFormatoNumContratoIncremento'];
        $formatoElem = $formatoData['NomFormatoNumContrato']['NomFormatoNumContratoElemento'];
//        print('/* ');
        //        print_r($formatoElem);die;
        $resut = array();
//        print_r($params);
        foreach($formatoElem as $val)
//            print_r($val);
            array_push($resut, $this->formatElementByType($val, $entidadConfig, $params));
//        print_r($resut);
//        die;
//        print(' */');
        return $resut;
    }

    function getFormatNumContratoElemeParams($contratodestino = null)
    {
        $contratodestino = $this->verificarContratodestino($contratodestino);
        $formatoData = ConfEntidadFormatoNumContrato::getFormatoNumContratoData($this->global->Estructura->idestructura, $contratodestino);
        $elements =  $formatoData['NomFormatoNumContrato']['NomFormatoNumContratoElemento'];

        $resut = array();
        foreach($elements as $val){

            if($val['tipo'] == 2 || $val['tipo'] == 4 || $val['tipo'] == 5  || $val['tipo'] == 6){
                switch($val['tipo']){
                    case 2: $nombreParam = $val['NomFormatoNumContratoElementoFecha']['nombreparametro'];break;
                    case 4: $nombreParam = $val['NomFormatoNumContratoElementoNomenclador']['nombreparametro'];break;
                    case 5: $nombreParam = $val['NomFormatoNumContratoElementoParametro']['nombreparametro'];break;
                    case 6: $nombreParam = 'idcontratomarco';break;
                }

                if($nombreParam){
                    array_push( $resut, array(
                        'idformatonumcontratoelemento' => $val['idformatonumcontratoelemento'],
                        'denominacion' => $val['denominacion'],
                        'tipo' => $val['tipo'],
                        'nombreparametro'=>$nombreParam
                    ));
                }
            }
        }
//        print_r($resut);die;
        return $resut;
    }

    function getFormatoNumContratoElementos($contratodestino = null, $params)
    {
        $contratodestino = $this->verificarContratodestino($contratodestino);
        $formatoData = ConfEntidadFormatoNumContrato::getFormatoNumContratoData($this->global->Estructura->idestructura, $contratodestino);
//        $elements = $formatoData['NomFormatoNumContrato']['NomFormatoNumContratoElemento'];
        $formatoData = ConfEntidadFormatoNumContrato::getFormatoNumContratoData($this->global->Estructura->idestructura,$contratodestino);
        $entidadConfig = $formatoData['ConfEntidadFormatoNumContratoIncremento'];
        $elements = $this->buildListElementos($formatoData['NomFormatoNumContrato']['NomFormatoNumContratoElemento'], $entidadConfig, $params);
        return $elements;
    }

    private function buildListElementos($element, $entidadConfig, $params)
    {
        $result = array();

        foreach($element as $val){
            array_push($result, array(
                'idformatonumcontratoelemento' => $val['idformatonumcontratoelemento'],
                'denominacion' => $val['denominacion'],
                'ejemplo' => $val['ejemplo'],
                'orden' => $val['orden'],
                'tipo' => $val['tipo'],
                'idformatonumcontrato' => $val['idformatonumcontrato'],
                'tipoinfo' => $val[$this->getTableNameByType($val['tipo'])]
            ));
        }

        return $result;
    }
    private function getTableNameByType($type)
    {
        switch($type){
            case 1 : return 'NomFormatoNumContratoElementoTexto';
            case 2 : return 'NomFormatoNumContratoElementoFecha';
            case 3 : return 'NomFormatoNumContratoElementoNumerico';
            case 4 : return 'NomFormatoNumContratoElementoNomenclador';
            case 5 : return 'NomFormatoNumContratoElementoParametro';
            case 6 : return 'NomFormatoNumContratoElementoNumerico';
            case 7 : return 'NomFormatoNumContratoElementoNumerico';
            case 8 : return 'NomFormatoNumContratoElementoNumerico';
        }
    }
    private function formatElementByType($val, $entidadConfig, $params)
    {
//        print(' ('.$val['tipo'].') ');
        switch($val['tipo']){
            case 1 : return $this->formatTextElement($val['NomFormatoNumContratoElementoTexto']);
            case 2 : return $this->formatDateElement($val['NomFormatoNumContratoElementoFecha'], $params);
            case 3 : return $this->formatNumericElement($val['NomFormatoNumContratoElementoNumerico'], $entidadConfig, $params);
            case 4 : return $this->formatNomElement($val['NomFormatoNumContratoElementoNomenclador'], $params);
            case 5 : return $this->formatParamElement($val['NomFormatoNumContratoElementoParametro'], $params);
            case 6 : return $this->formatConsecutivoElement('marco', $val['NomFormatoNumContratoElementoNumerico'], $entidadConfig, $params);
            case 7 : return $this->formatConsecutivoElement('especifico', $val['NomFormatoNumContratoElementoNumerico'], $entidadConfig, $params);
            case 8 : return $this->formatConsecutivoElement('suplemento', $val['NomFormatoNumContratoElementoNumerico'], $entidadConfig, $params);
            default: return 'test';
        }
    }

    private function formatTextElement($elem)
    {
        return $elem['caracteres'];
    }

    private function formatDateElement($elem, $params)
    {
        if($elem['generada'] == 1)
            return date($elem['formato']);
        else{
            $dateFormat = DateTime::createFromFormat('d/m/Y', $params[$elem['nombreparametro']]);
            if($dateFormat)
                return $dateFormat->format($elem['formato']);
        }
    }

    private function formatNumericElement($elem, $entidadConfig, $params)
    {
        $idelemtype = $elem['idformatonumcontratoelemento'];
        $valorEntidad = ($params['consecutivoactual'] == true)
            ? $this->searchNumericValueEntidadConfig(
                $idelemtype, $entidadConfig
            ) : 0;

        if ($elem['incluircerosizquierda'] == 1) {
            return $this->rellenarIzqCeros($valorEntidad, $elem['longitud']);
        }
        return $valorEntidad;
    }

    private function searchNumericValueEntidadConfig($idformt, $entidadConfig)
    {
        foreach($entidadConfig as $value){
            if($idformt == $value['idformatonumcontratoelemento'])
                return $value['valor'];
        }

        return 0;
    }

    private function rellenarIzqCeros($value, $length)
    {
        return str_pad($value, $length, "0", STR_PAD_LEFT);
    }

    private function formatNomElement($elem, $params)
    {
        $idnomelem = $params[$elem['nombreparametro']];
        $result = null;
        foreach($elem['NomFormatoNumContratoElementoNomencladorValor'] as $value){
            if($value['idnomencladorelemento'] == $idnomelem)
                $result = $value['valor'];
        }

        return $result;
    }

    private function formatParamElement($elem, $params)
    {
        return $params[$elem['nombreparametro']];
    }

    function incrementarConsecutivos_old($contratodestino)
    {
        $contratodestino = $this->verificarContratodestino($contratodestino);
        $identidad = $this->global->Estructura->idestructura;
        $elemIncr = ConfEntidadFormatoNumContratoIncremento::getElementosIncrementalesByEntidad($identidad,$contratodestino);

        foreach($elemIncr as $value)
            ConfEntidadFormatoNumContratoIncremento::incrementarValor($value['identidadformatonumcontratoincremento']);
    }

    function incrementarConsecutivos($idcontrato, $contratodestino, $params)
    {
        $contratodestino = $this->verificarContratodestino($contratodestino);
        $identidad = $this->global->Estructura->idestructura;
        $elemIncr = ConfEntidadFormatoNumContratoIncremento::getElementosIncrementalesByEntidad($identidad,$contratodestino);
        $elemGenerales = $elemIncr['ConfEntidadFormatoNumContratoIncremento'];
        $elemConfig = $elemIncr['NomFormatoNumContrato']['NomFormatoNumContratoElemento'];
//        print_r($params);die;
        if($params['marco'] !== null && $params['marco'] == 0){
//            print('/*1*/');die;
            $this->updateIncrementalesMarco($idcontrato, $params, $elemGenerales, $elemConfig);
        }elseif($params['especifico'] !== null && $params['especifico']== 0){
//            print('2');die;
            $this->updateIncrementalesEspecifico($idcontrato, $params, $elemGenerales, $elemConfig);
        }elseif($params['suplemento'] !== null && $params['suplemento']== 0){
//            print('3');die;
            $this->updateIncrementalesSuplemento($idcontrato, $params, $elemGenerales, $elemConfig);
        }

        $this->updateIncrementalesGenerales($elemGenerales, $elemConfig, $params);
//        foreach($elemIncr as $value)
//            ConfEntidadFormatoNumContratoIncremento::incrementarValor($value['identidadformatonumcontratoincremento']);
    }

    private function updateIncrementalesGenerales($elemIncr, $elemConfig, $params)
    {

        foreach($elemIncr as $key => $value){
            $elemType = $elemConfig[$key]['tipo'];
            $isInsertMarco = $elemType == 6 && $params['marco'] === 0;
            $isInsertEspecificoSinMarco = $elemType == 7 && $params['especifico'] === 0 && !$params['marco'];

            if( $elemType == 3 || $isInsertMarco ||  $isInsertEspecificoSinMarco )
                ConfEntidadFormatoNumContratoIncremento::incrementarValor($value['identidadformatonumcontratoincremento']);
        }
    }

    private function updateIncrementalesMarco($idcontrato, $params, $elemsGenerales, $elemsConfig)
    {
        $elem = array();
        foreach($elemsConfig as $value){
            if($value['tipo'] == 6)$elem = $value;
        }

        $consecMarco = $this->formatConsecutivoElement('marco', $elem['NomFormatoNumContratoElementoNumerico'], $elemsGenerales, $params);
//        print_r($consecMarco);die;
        DatContratoConsecutivo::initConsecutivoContrato($idcontrato, $consecMarco);
    }

    private function updateIncrementalesEspecifico($idcontrato, $params, $elemsGenerales, $elemsConfig)
    {
        $elem = array();
        foreach($elemsConfig as $value){
            if($value['tipo'] == 7)
                $elem = $value;
        }
        $model = new DatContratoConsecutivo();
        if($params['marco']){
            $consecMarco = $model->getConsecutivoById($params['marco']);
            $consecEpecifico = $this->rellenarIzqCeros($consecMarco['consecutivoespecifico'], $elem['NomFormatoNumContratoElementoNumerico']['longitud']);

            $model->initConsecutivoContrato($idcontrato, $consecEpecifico);
            $model->incrementarConsecutivoEspecifico($params['marco']);

        }elseif($params['marco']!==0){
            $consecEpecifico = $this->formatConsecutivoElement('especifico', $elem['NomFormatoNumContratoElementoNumerico'], $elemsGenerales, $params);
            $model->initConsecutivoContrato($idcontrato, $consecEpecifico);
        }
    }

    private function updateIncrementalesSuplemento($idcontrato, $params, $elemsGenerales, $elemsConfig)
    {
        $elem = array();
        foreach($elemsConfig as $value){
            if($value['tipo'] == 7)
                $elem = $value;
        }
        $model = new DatContratoConsecutivo();

        if($params['marco'] && empty($params['especifico']) ){
            $consecMarco = $model->getConsecutivoById($params['marco']);
            $consecSuplemento = $this->rellenarIzqCeros($consecMarco['consecutivosuplemento'], $elem['NomFormatoNumContratoElementoNumerico']['longitud']);

            $model->initConsecutivoContrato($idcontrato, $consecSuplemento);
            $model->incrementarConsecutivoSuplemento($params['marco']);
        }elseif($params['especifico']){
            $consecEspec = $model->getConsecutivoById($params['especifico']);
            $consecSuplemento = $this->rellenarIzqCeros($consecEspec['consecutivosuplemento'], $elem['NomFormatoNumContratoElementoNumerico']['longitud']);

            $model->initConsecutivoContrato($idcontrato, $consecSuplemento);
            $model->incrementarConsecutivoSuplemento($params['especifico']);
        }
    }

    function modificarElementosNumContrato($numContrato, $newValues)
    {
        if(!is_array($newValues))
            throw new Exception("Formato de parámetro incorrecto");

        $formatoData = ConfEntidadFormatoNumContrato::getFormatoNumContratoData($this->global->Estructura->idestructura);
        $formatoElem = $formatoData['NomFormatoNumContrato']['NomFormatoNumContratoElemento'];

        $result = array();
        foreach($formatoElem as $key=>$value){

            $newVal = null;

            if($value['tipo'] == 4){
                $newVal = $this->formatNomElement($value['NomFormatoNumContratoElementoNomenclador'], $newValues);
            }elseif ($value['tipo'] == 2 && $value['NomFormatoNumContratoElementoFecha']['generada'] != 1){
                $newVal = $this->formatDateElement($value['NomFormatoNumContratoElementoFecha'], $newValues);
            }

            array_push($result, ($newVal == null)? $numContrato[$key] : $newVal);
        }

        return $result;
    }

    function verificarContratodestino($contratodestino){
        $formatos = ConfEntidadFormatoNumContrato::getFormatoNumContrato($this->global->Estructura->idestructura);
        foreach ($formatos as $formato){
            if($formato['contratodestino'] == $contratodestino){
                return $contratodestino;
            }
        }
        return 1;
    }

    private function formatConsecutivoElement($paramName, $elemConfig, $entidadConfig, $params)
    {
//        print_r(' '.$paramName.':'.$params[$paramName].' ');
//        print_r('$params[$paramName]'.$params[$paramName].'/');
        if( $params[$paramName] === null ){
//            print(' [null] ');
//            print('return: 000'.$paramName.'//');
            return $this->rellenarIzqCeros(0, $elemConfig['longitud']);
        }elseif( $params[$paramName] == 0){
//            print(' [0] ');
            switch($paramName){
                case 'marco':
//                    print(' [marco] ');
                    return $this->formatNumericElement($elemConfig, $entidadConfig, $params);
                case 'especifico':
//                    print(' [especifico] ');
                    if($params['marco']){
//                        print(' [especifico marco] ');
                        $consecMarco = DatContratoConsecutivo::getConsecutivoById($params['marco']);
//                        print_r($consecMarco);
                        return $this->rellenarIzqCeros($consecMarco['consecutivoespecifico'], $elemConfig['longitud']);
                    }else{
//                        print(' [especifico else] ');
                        return $this->formatNumericElement($elemConfig, $entidadConfig, $params);
                    }
                case 'suplemento':
//                    print(' [suplemento] ');
                    if( ($params['marco'] && $params['especifico']) ||  empty($params['marco'])  ){
                        $consecEspec = DatContratoConsecutivo::getConsecutivoById($params['especifico']);
                        return $this->rellenarIzqCeros($consecEspec['consecutivosuplemento'], $elemConfig['longitud']);
                    }else if($params['marco']){
                        $consecMarco = DatContratoConsecutivo::getConsecutivoById($params['marco']);
                        return $this->rellenarIzqCeros($consecMarco['consecutivosuplemento'], $elemConfig['longitud']);
                    }
                    break;
            }
        }else{
//            print(' [else] ');
            if($paramName == 'suplemento')
                return $this->rellenarIzqCeros(0, $elemConfig['longitud']);

            $consec = DatContratoConsecutivo::getConsecutivoById($params[$paramName]);
            return $consec['consecutivo'];
        }
    }
}
