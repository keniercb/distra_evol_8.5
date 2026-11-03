<?php

/**
 * Class GenerateClientSide
 */
class GenerateClientSide extends GeneratorCodePersona
{
    /**
     * @var
     */
    private $arrWebArchitect;

    /**
     * @var
     */
    private $webPath;

    /**
     * @var string
     */
    private $namespace;

    private $createdFunctions;

    /**
     * @param $nameProject
     * @param $webPath
     * @param $arrWebArchitect
     */
    function __construct($nameProject, $webPath, $arrWebArchitect)
    {
        $this->nameProject = $nameProject;
        $this->webPath = $webPath;
        $this->arrWebArchitect = $arrWebArchitect;
        $this->namespace = 'Ext.ns("Ext.persona");' . self::LINE_FEED;
        $this->fileManager = new ZendExt_File();
        $this->objDocblock = new Zend_CodeGenerator_Php_Docblock();
    }

    /**
     * Funcion que crea la estructura de carpetas del proyecto en web
     *
     * @param String $nameProject
     * @param String $pPath
     * @param int $chmod
     */
    public function createFileWebProject($chmod = null)
    {
        foreach ($this->arrWebArchitect as $k => $v) {
            $this->arrWebArchitect[$k] = str_replace('{}', $this->nameProject, $v);
            $this->fileManager->mkdir($this->webPath . $this->arrWebArchitect[$k], $chmod);
        }
        $this->createFileIndex();
    }

    public function createFileIndex()
    {
        $path = $this->webPath . $this->arrWebArchitect['nameProject'] . '/index.php';
        if (!file_exists($path)) {
            $code = '<?php' . self::LINE_FEED . "include_once('../index.php');";
            $this->fileManager->mkfile($code, $path);
        }
    }

    /**
     * @param $context
     */
    public function generateJsFiles($context)
    {
        if (!empty($context)) {
            $codigo = $this->namespace;
            foreach ($context['DatProyectoconcepto'] as $v) {
                $codigo .= $this->writeJsFormat(
                        'cmp' . $v['idproyectoconcepto'], json_decode($v['codigo']), $v['denominacion']
                    ) . self::LINE_FEED;
            }
            $path = $this->webPath . $this->arrWebArchitect['js'] . '/' . $context['idproyecto'] .
                self::FUNCTIONS_NAME . '.js';
            $this->createdFunctions['js'][] = $this->arrWebArchitect['js'] . '/' . $context['idproyecto'] .
                self::FUNCTIONS_NAME . '.js';
            $this->fileManager->mkfile($codigo, $path);
            $this->generateInitFunction($context['idproyecto'], $context['denominacion'], $context['idconfiguracion']);
        }
    }

    /**
     * @param $cmpName
     * @param $context
     * @param $denomOnBd
     *
     * @return string
     */
    private function writeJsFormat($cmpName, $context, $denomOnBd)
    {
        $codigo = $this->generateDocBlock('Componente ' . $denomOnBd);
        $codigo .= 'Ext.persona.' . $cmpName . ' = {' . self::LINE_FEED;
        $codigo .= $this->generateJsCodeFunctions($context);
        $codigo .= self::LINE_FEED . '};';

        return $codigo;
    }

    /**
     * @param $context
     *
     * @return string
     */
    private function generateDocBlock($context)
    {
        $this->objDocblock->setShortDescription($context);

        return $this->objDocblock->generate();
    }

    /**
     * @param $context
     *
     * @return string
     */
    private function generateJsCodeFunctions($context)
    {
        $codigo = '';
        foreach ($context as $k => $v) {
            if (!empty($v)) {
                $codigo .= $k . ':';
                if ($v instanceof stdClass) {
                    $codigo .= '{' . self::LINE_FEED;
                    $codigo .= $this->generateJsCodeFunctions($v);
                    $codigo .= self::LINE_FEED . '},';
                } else {
                    $codigo .= $v . ',' . self::LINE_FEED;
                }
            }
        }

        return $codigo;
    }

    /**
     * @param $idProject
     * @param $denom
     * @param $idReccompleja
     */
    private function generateInitFunction($idProject, $denom, $idReccompleja)
    {
        $code = $this->generateDocBlock($denom);
        $code .= '(function()' . self::LINE_FEED . '{' . self::LINE_FEED;
        $code .= $this->indentation . 'var view = new Ext.PersonaGenerico.ViewBase({' . self::LINE_FEED;
        $code .= $this->indentation . $this->indentation .
            "configPersona:{idproyecto:'$idProject',idreccomplejas:'$idReccompleja'}" . self::LINE_FEED;
        $code .= $this->indentation . '});' . self::LINE_FEED;
        $code .= self::LINE_FEED . '})();';
        $path = $this->webPath . $this->arrWebArchitect['js'] . '/' . $idProject .
            self::INIT_NAME . '.js';
        $this->createdFunctions['js'][] = $this->arrWebArchitect['js'] . '/' . $idProject . self::INIT_NAME . '.js';
        if (!file_exists($path)) {
            $this->fileManager->mkfile($code, $path);
        }
    }

    public function getCreatedFuntions()
    {
        return $this->createdFunctions;
    }
}