<?php 
class ReporteValidator extends BaseValidator
{
    public function validateGetReportes($idmodulo)
    {
        $this->validateArgumentValues(
            array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 3,
            ),
            $idmodulo, 'idmodulo'
        );
    }

    public function validateInsert($values)
    {
        $this->validateArrayArgumentValues($values, $this->getInsertArgumentsConfig());
        $this->validateDuplicationValues('ReporteRepository', $this->getInsertDuplicationTerms($values));
    }

    public function validateUpdate($values)
    {
        $this->validateArrayArgumentValues($values, $this->getUpdateArgumentsConfig());
        $this->validateDuplicationValues('ReporteRepository', $this->getUpdateDuplicationTerms($values));
    }

    public function validateDelete($idreporte)
    {
        $this->validateArgumentValues(
            array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 19,
            ),
            $idreporte, 'idreporte'
        );
    }

    private function getInsertArgumentsConfig()
    {
        return array(
            'idpadre' =>  array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 19,
            ),
            'denominacion' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 150,
                'regex' => '/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/'
            ),
            'agrupador' => array(
                'empty' => false,
                'minValue' => 0,
                'maxValue' => 1
            ),
            'identificador' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 50,
                'regex' => '/^[0-9a-zA-Z]+$/'
            ),
            'urldatos' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 255
            ),
            'idmodulo' =>  array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 3,
            )
        );
    }

    private function getInsertDuplicationTerms($values)
    {
        $conficions = array(
            1 => array(
                'equalIdentificador'=> $values['identificador'],
                'equalIdmodulo' => $values['idmodulo'],
            ),
            2 => array(
                'equalDenom'=> $values['denominacion'],
                'equalIdmodulo' => $values['idmodulo'],
            )
        );

        if($values['agrupador'] == 1)
            unset($conficions[1]);

        return $conficions;
    }

    private function getUpdateArgumentsConfig()
    {
        $insertArg = $this->getInsertArgumentsConfig();

        $insertArg['idreporte'] = array(
            'empty' => false,
            'minLength' => 0,
            'maxLength' => 19,
        );

        return $insertArg;
    }

    private function getUpdateDuplicationTerms($values)
    {
        $insertTerms = $this->getInsertDuplicationTerms($values);

        foreach($insertTerms as &$elem)
            $elem['distinctId'] = $values['idreporte'];

        return $insertTerms;
    }
}