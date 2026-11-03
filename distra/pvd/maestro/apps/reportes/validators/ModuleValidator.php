<?php 
class ModuleValidator extends BaseValidator
{
    public function validateInsert($values)
    {
        $this->validateArrayArgumentValues($values, $this->getInsertArgumentsConfig());
        $this->validateDuplicationValues('ModuleRepository', $this->getInsertDuplicationTerms($values));
    }

    public function validateUpdate($values)
    {
        $this->validateArrayArgumentValues($values, $this->getUpdateArgumentsConfig());
        $this->validateDuplicationValues('ModuleRepository', $this->getUpdateDuplicationTerms($values));
    }

    public function validateDelete($idsmodule)
    {
        if(is_array($idsmodule) && count($idsmodule))
        {
            foreach($idsmodule as $value)
                $this->validateDeleteArgument($value);
        }else
            $this->validateDeleteArgument($idsmodule);

        $this->validateModuleInUse($idsmodule);
    }

    private function getInsertDuplicationTerms($values)
    {
        return array(
            1 => array('equalIdentificador'=> $values['identificador']),
            2 => array('equalDenom'=> $values['denominacion'])
        );
    }

    private function getUpdateDuplicationTerms($values)
    {
        $insertTerms = $this->getInsertDuplicationTerms($values);

        foreach($insertTerms as &$elem)
            $elem['distinctId'] = $values['idmodulo'];

        return $insertTerms;
    }

    private function getInsertArgumentsConfig()
    {
        return array(
            'identificador' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 50,
                'regex' => '/^[0-9a-zA-Z]+$/'
            ),
            'denominacion' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 150,
                'regex' => '/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/'
            ),
        );
    }

    private function getUpdateArgumentsConfig()
    {
        $insertArg = $this->getInsertArgumentsConfig();

        $insertArg['idmodulo'] = array(
            'empty' => false,
            'minLength' => 0,
            'maxLength' => 3,
        );

        return $insertArg;
    }

    private function validateDeleteArgument($value)
    {
        $this->validateArgumentValues(
            array(
                'empty' => false,
                'minValue' => 0,
                'maxValue' => 999,
            ),
            $value, 'idsmodule'
        );
    }

    private function validateModuleInUse($idsmodule)
    {
        $isModulesInUse = (new ReporteRepository())->getCountReportesInModules(
            is_array($idsmodule)?$idsmodule:array($idsmodule)
        );

        if($isModulesInUse)
            throw new ElementInUseException('El m&oacute;dulo est&aacute; en uso.', 1);
    }
}