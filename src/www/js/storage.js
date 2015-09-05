
function setItem( key, value )
{
    if ( notSupportStored() )
    {
        gStoredItem[key] = value;
    }
    else if ( !window.localStorage )
        setCookie( key, value, 100 );
    else
        localStorage.setItem( key, value );
}

function getItem( key )
{
    if ( notSupportStored() )
    {
        return gStoredItem[key];
    }
    else if ( !window.localStorage )
        return getCookie( key );
    else
        return localStorage.getItem( key );
}

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
    {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1)
    {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function removeItem( key )
{
    if ( document.all && !window.localStorage )
    {
        document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    else
    {
        localStorage.removeItem( key );
    }
}


function removeAllItem()
{
    if ( document.all && !window.localStorage )
    {
        for ( var i = 0; i < KEY_ALL_ARRAY.length; i ++ )
        {
            var key = KEY_ALL_ARRAY[i];
            document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        showAlert( "all cookie are clear" );
    }
    else
    {
        localStorage.clear();
        showAlert( "all local storage are clear" );
    }
}