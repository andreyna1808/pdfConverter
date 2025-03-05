using PdfConverterAPI.Models.Responses;

namespace PdfConverterAPI.Responses
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse(500, "Ocorreu um erro interno.", ex.Message);
                httpContext.Response.StatusCode = 500;
                await httpContext.Response.WriteAsJsonAsync(errorResponse);
            }
        }
    }
}
