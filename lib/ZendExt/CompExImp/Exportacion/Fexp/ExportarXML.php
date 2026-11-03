<?php
class ZendExt_CompExImp_Exportacion_Fexp_ExportarXML implements ZendExt_CompExImp_IExportadorConcreto
{

    function __construct()
    {

    }

    public function exportar($obj, $dir)
    {
        $dir .= ".exp";
        $xml = $this->CrearSimpleXML($dir);
        $xml = $this->FormarXML($xml, $obj, null);
        $this->CrearFichero($xml, $dir);
        return $xml->asXML();
    }

    private function CrearSimpleXML($dir)
    {
        $fs = fopen($dir, "w");
        fputs($fs, "<?php\n");
        fputs($fs, "\$xmlstr=<<<XML\n");
        fputs($fs, "<?xml version=\"1.0\" encoding=\"UTF-8\"\n");
        fputs($fs, "<Objeto></Objeto>\n");
        fputs($fs, "XML;\n");
        fputs($fs, "");
        fclose($fs);
        require($dir);
        $xml = new SimpleXMLElement($xmlstr);
        return $xml;
    }

    private function CrearFichero($xml, $dir)
    {
        $texto = $xml->asXML();
        $fs = fopen($dir, "w");
        fputs($fs, $texto);
    }

    private function FormarXML($objxml, $obj, $namevar)
    {
        $xml = $objxml;
        if (is_array($obj)) {
            $classname = 'Array';
            $child = $xml->addChild($classname);
            $child = $this->FormarArray($child, $obj);
        } else {
            $classname = get_class($obj);
            $child = $xml->addChild($classname);
            if ($namevar != null) {
                $child->addChild("NameVar");
                $child->NameVar = $namevar;
            }
            $infobj = new ReflectionObject($obj);
            $arrprop = array_keys($infobj->getDefaultProperties());
            foreach ($arrprop as $value) {
                $vars = new ReflectionProperty(get_class($obj), $value);
                if ($vars->isPublic()) {
                    $valor = $vars->getValue($obj);
                    if (is_array($valor)) {
                        $arrchild = $child->addChild("Array");
                        $arrchild->addChild("NameVar");
                        $arrchild->NameVar = $value;
                        $arrchild = $this->FormarArray($arrchild, $valor);
                    } elseif (!is_object($valor)) {
                        $child->addAttribute($value, $valor);
                    } else {
                        $child = $this->FormarXML($child, $valor, $value);
                    }
                }
            }
        }
        return $xml;
    }

    private function FormarArray($child, $array)
    {
        $num = 0;
        $llaves = array_keys($array);
        foreach ($array as $value) {
            $llave = $llaves [$num];
            if (is_int($llave)) {
                $llave = "keynum" . $llave;
            }
            if (is_array($value)) {
                $arrchild = $child->addChild("Array");
                $arrchild->addChild("NameVar");
                $arrchild->NameVar = $llave;
                $arrchild = $this->FormarArray($arrchild, $value);
            } elseif (!is_object($value)) {

                $child->addAttribute($llave, $value);
            } else {
                $child = $this->FormarXML($child, $value, $llaves [$num]);
            }
            $num++;
        }
        return $child;
    }
}
