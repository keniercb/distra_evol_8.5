<?php
//Direccion de la servidora
$dir_index = __FILE__;

//Direccion del fichero de configuracion
$config_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/comun/config.php';

if (!file_exists($config_file)) { //Si no existe el fichero de configuracion
    //Se dispara una excepcion
    throw new Exception('El fichero de configuracion no existe');
} elseif (!is_readable($config_file)) { //Si no se puede leer
    //Se dispara una excepcion
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else { //Si existe el fichero y se puede leer
    //Se inicializa la variable de configuración
    $config = array();

    //Se incluye el fichero
    include_once($config_file);

    $dirCerts = substr(__FILE__, 0, strrpos(__FILE__, 'web')) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;
    $configCert = parse_ini_file($dirCerts . 'rsa.ini');
    $publicKey = addcslashes(file_get_contents($dirCerts . $configCert['publicKey']), '\\');
    $development = ($config['development']) ? 'true' : 'false';
    if (count($_REQUEST) == 0) {
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://';
        $url = $protocol . $_SERVER['HTTP_HOST'];
        $locate = "<html><head></head><body onload=\"document.getElementById('form1').submit()\">";
        $locate .= "<form id='form1' action= $url method='POST'>";
        $locate .= "</form></body></html>";
        echo $locate;
        return;
    }
}
?>
<style id="antiClickjack">body{display:none !important;}</style>
<script type="text/javascript">
    if (self === top || self.location.origin === top.location.origin) {
        var antiClickjack = document.getElementById('antiClickjack');
        antiClickjack.parentNode.removeChild(antiClickjack);
    } else {
        top.location = self.location;
    }
</script>


<script type="text/javascript"> var development = <?php echo htmlentities($development); ?>; </script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="../../../lib/ExtJS/temas/default/css/ext-all.css"/>
    <link rel="stylesheet" href="style.css" type="text/css"/>
    <link rel="stylesheet" href="help.css" type="text/css"/>
    <link rel="stylesheet" href="virtualkeyboard.css" type="text/css"/>
    <title>SISTEMA DE GESTIÓN INTEGRAL DE SEGURIDAD</title>
    <script type="text/javascript" src="../../../lib/UCID/js/imporcss.js"></script>
    <script type="text/javascript" src="../../../lib/ExtJS/idioma/es/js/ext-base.js"></script>
    <script type="text/javascript" src="../../../lib/ExtJS/idioma/es/js/ext-all.js"></script>
    <script type="text/javascript" src="../../../lib/ExtJS/idioma/es/js/ext-all-debug.js"></script>
    <script type="text/javascript" src="../../../lib/UCID/js/ucid-all.js"></script>
</head>
<body class="bg_body">
<input id="publicKey" name="publicKey" type="text" style="display:none" hidden="true"
       value="<?php echo $publicKey; ?>"/>
<table width="100%" height="100%">
    <tr>
        <td align="center" valign="middle">
            <div id="log_midle">
                <div id="loading-mask"></div>
                <table width="100%" height="100%">
                    <tr>
                        <td align="center" valign="middle">
                            <div id="dFormIndex">
                            </div>
                            <form id="form1" name="form1"
                                  action="<?php echo $_REQUEST['url_self'] . 'response/index.php' ?>" method="POST">
                                <table>
                                    <tr>
                                        <td><input type="hidden" name="username" id="input_log_north"/></td>
                                    </tr>
                                    <tr>
                                        <td><input type="hidden" name="password" id="input_log_south"/></td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <input type="hidden" value="<?php echo $_REQUEST['captcha']; ?>"
                                                   name="id_captcha" id="id_captcha"/>
                                            <input type="hidden" value="" name="captchabox" id="captchabox"/>
                                        </td>
                                    </tr>
                                </table>
                                <div align="center" id="error" style="margin-bottom:4em; left:200px; top:200px;">
                                    <label class="error"><?php
                                        if (isset($_REQUEST['error'])) {
                                            echo $_REQUEST['error'];
                                        }
                                        ?>
                                    </label>
                                </div>
                            </form>
                        </td>
                    </tr>
                </table>
                <div id="loading">
                </div>
        </td>
    </tr>
</table>
</body>
<script type="text/javascript" src="secure/HelpIcon.js"></script>
<script type="text/javascript" src="secure/Ext.ux.VirtualKeyboard.js"></script>
<script type="text/javascript" src="secure/Ext.ux.plugins.VirtualKeyboard.js"></script>
<script type="text/javascript" src="secure/md5.js"></script>
<script language="JavaScript" type="text/javascript" src="/lib/UCID/js/security/rsa/jsbn.js"></script>
<script language="JavaScript" type="text/javascript" src="/lib/UCID/js/security/rsa/rsa.js"></script>
<script type="text/javascript" src="secure/login.js"></script>
</html>
